import {NextApiRequest, NextApiResponse} from "next/types";
import {blockcypherFetch} from "../../../lib/blockcypherFetch.ts";
import prisma from "../../../prisma/db.ts";
import {z} from "zod";
import cookie from "cookie";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || '');
    let session = cookies.session ? JSON.parse(cookies.session) : null;
    if (!session)
        return res.status(200).json({ message: 'Not authorized' });

    const validator = z.object({
        address: z.string().optional(),
    });
    const result = validator.safeParse(req.query);
    if (result.success === false)
        return res.status(200).json(result.error.issues);

    const { address }: z.infer<typeof validator> = result.data;

    console.log(address);
    console.log(session.user);
    console.log(session.user.userID);


    let wallet = await prisma.wallet.findFirst({
       where: {
           OR: [
               { userID: session.user.userID },
               { address },
           ],
       }
    });

    console.log(wallet);

    const data = await blockcypherFetch(`https://api.blockcypher.com/v1/btc/main/addrs/${wallet.address}`)

    if (data.txrefs) {
        for (let i = 0; i < data.txrefs.length; i++) {
            const txref = data.txrefs[i];
            let transaction = await prisma.transaction.findFirst({
                where: {
                    txhash: txref.tx_hash,
                },
            });
            if (!transaction) {
                transaction = await prisma.transaction.create({
                    data: {
                        userID: session.user.userID,
                        walletID: wallet.walletID,
                        txhash: txref.tx_hash,
                        amount: txref.value,
                        confirmations: txref.confirmations,
                    },
                });
            }
        }
    }


    const transactions = await prisma.transaction.findMany({
        where: {
            walletID: wallet.walletID,
        },
    });
    let balance = 0;
    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        balance += transaction.amount;
    }
    wallet = await prisma.wallet.update({
        where: {
            walletID: wallet.walletID,
        },
        data: {
            balance,
        },
    });

    return res.status(200).json({
        wallet,
        transactions,
    });
}