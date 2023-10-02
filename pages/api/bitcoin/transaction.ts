import {NextApiRequest, NextApiResponse} from "next/types";
import {blockcypherFetch} from "../../../lib/blockcypherFetch.ts";
import cookie from "cookie";
import {z} from "zod";
import prisma from "../../../prisma/db.ts";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || '');
    let session = cookies.session ? JSON.parse(cookies.session) : null;
    if (!session)
        return res.status(200).json({ message: 'Not authorized' });

    const validator = z.object({
        txhash: z.string(),
        address: z.string(),
    });
    const result = validator.safeParse(req.query);
    if (result.success === false)
        return res.status(200).json(result.error.issues);

    const { txhash, address }: z.infer<typeof validator> = result.data;

    let transaction = await prisma.transaction.findFirst({
        where: {
            txhash,
        },
    });

    const txn = await blockcypherFetch(`https://api.blockcypher.com/v1/btc/main/txs/${txhash}`);

    if (!transaction) {
        const wallet = await prisma.wallet.findFirst({
            where: {
                address,
                userID: session.user.userID,
            },
        });


        transaction = await prisma.transaction.create({
            data: {
                userID: session.user.userID,
                walletID: wallet.walletID,
                txhash: txn.tx_hash,
                amount: txn.value,
                confirmations: txn.confirmations,
            },
        });
    }

    const transactionInputs = await prisma.transactionInput.findMany({
        where: {
            transactionID: transaction.transactionID,
        },
    });
    if (transactionInputs.length === 0) {
        for (let i = 0; i < txn.inputs.length; i++) {
            const input = txn.inputs[i];

            const transactionInput = await prisma.transactionInput.create({
                data: {
                    transactionID: transaction.transactionID,
                    address: input.addresses[0],
                    amount: input.output_value,
                    script: input.script,
                    scriptType: input.script_type,
                },
            });
            transactionInputs.push(transactionInput);
        }
    }

    const transactionOutputs = await prisma.transactionOutput.findMany({
        where: {
            transactionID: transaction.transactionID,
        },
    });
    if (transactionOutputs.length === 0) {
        for (let i = 0; i < txn.outputs.length; i++) {
            const output = txn.outputs[i];

            const transactionOutput = await prisma.transactionOutput.create({
                data: {
                    transactionID: transaction.transactionID,
                    address: output.addresses[0],
                    amount: output.value,
                    script: output.script,
                    scriptType: output.script_type,
                },
            });
            transactionOutputs.push(transactionOutput);
        }
    }

    // update to and from addresses
    if (txn.addresses.length >= 2) {
        let fromAddress = txn.addresses[1];
        let toAddress = txn.addresses[0];

        let isToAddressCorrect = false;
        for (let i = 0; i < txn.outputs.length; i++) {
            const output = txn.outputs[i];
            if (output.addresses.includes(toAddress)) {
                isToAddressCorrect = true;
                break;
            }
        }

        if (!isToAddressCorrect) {
            fromAddress = txn.addresses[0];
            toAddress = txn.addresses[1];
        }

        transaction = await prisma.transaction.update({
            where: {
                transactionID: transaction.transactionID,
            },
            data: {
                fromAddress,
                toAddress,
            }
        });
    }


    return res.status(200).json({
        transaction,
        transactionInputs,
        transactionOutputs,
    });
}