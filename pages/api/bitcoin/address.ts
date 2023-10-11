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

    let dbAddress = await prisma.address.findFirst({
       where: {
           OR: [
               { userID: session.user.userID },
               { address },
           ],
       }
    });

    let transactions = [];
    if (dbAddress) {
        transactions = await prisma.transaction.findMany({
            where: {
                addressID: dbAddress.addressID,
            },
        });
    }


    return res.status(200).json({
        address: dbAddress,
        transactions,
    });
}