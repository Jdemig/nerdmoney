import {NextApiRequest, NextApiResponse} from "next/types";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.setHeader("Access-Control-Allow-Origin", "https://main--nerdmoney.netlify.app");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method !== 'POST')
        return res.end();

    return res.send('ok');
}