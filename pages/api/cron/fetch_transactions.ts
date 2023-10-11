import {NextApiRequest, NextApiResponse} from "next/types";
import prisma from "../../../prisma/db.ts";
import {blockcypherFetch} from "../../../lib/blockcypherFetch.ts";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('cron');
    console.log(req.method);

    const accounts = await prisma.account.findMany({
        orderBy: {
            updatedAt: 'desc',
        },
    });

    for (const account of accounts) {
        console.log(account);

        const addresses = await prisma.address.findMany({
            where: {
                accountID: account.accountID,
            },
        });

        for (const address of addresses) {
            console.log(address);

            const data = await blockcypherFetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address.address}`);

            if (data.txrefs) {
                for (let i = 0; i < data.txrefs.length; i++) {
                    const txref = data.txrefs[i];

                    const txn = await blockcypherFetch(`https://api.blockcypher.com/v1/btc/main/txs/${txref.txhash}`);

                    console.log(txn);

                    let transaction = await prisma.btcTransaction.findFirst({
                        where: {
                            txhash: txref.tx_hash,
                        },
                    });
                    if (!transaction) {
                        transaction = await prisma.btcTransaction.create({
                            data: {
                                userID: account.userID,
                                accountID: account.accountID,
                                addressID: address.addressID,
                                txhash: txref.tx_hash,
                                amount: txref.value,
                                confirmations: txref.confirmations,
                            },
                        });
                    }
                }
            }

        }
    }
}