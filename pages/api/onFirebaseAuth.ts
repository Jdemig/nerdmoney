import {NextApiRequest, NextApiResponse} from 'next/types';
import {adminAuth} from "../../lib/initFirebaseAdmin.ts";
import prisma from "../../prisma/db.ts";
import cookie from "cookie";
import AccountService from "../../services/AccountService.ts";
import {sendStdError} from "../../utils/response.ts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return sendStdError(res, 'Not authorized');
        }

        const token = authorization.replace('Bearer', '').trim();

        adminAuth
            .verifyIdToken(token)
            .then(async (decodedToken) => {
                const userRecord = await adminAuth.getUser(decodedToken.uid);

                let firebaseUserEmail = userRecord.email;
                if (!firebaseUserEmail)
                    firebaseUserEmail = userRecord.providerData[0].email;

                if (!firebaseUserEmail)
                    return res.status(200).json({ message: 'Email is required' });

                let user = await prisma.user.findFirst({
                    where: {
                        email: firebaseUserEmail,
                    }
                });

                try {
                    if (!user) {
                        user = await prisma.user.create({
                            data: {
                                email: firebaseUserEmail,
                            },
                        });

                        await AccountService.generateNewAccountOnSignUp(user.userID);
                    }
                } catch (e) {
                    return sendStdError(res, e);
                }

                const cookies = cookie.parse(req.headers.cookie || '');

                let session = cookies.session ? JSON.parse(cookies.session) : null;

                if (!session)
                    session = {};

                session.user = user;
                session.token = token;

                const serializedCookie = cookie.serialize('session', JSON.stringify(session), { path: '/' });
                res.setHeader('Set-Cookie', serializedCookie);

                return res.send(session);
            });
    }
}