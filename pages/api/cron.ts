
import {NextApiRequest, NextApiResponse} from "next/types";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('cron');
    console.log(req.method);
}