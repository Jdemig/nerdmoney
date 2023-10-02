import prisma from "../lib/db.ts";
import {ADDRESS_LIST} from "../lib/addresses.ts";



class WalletService {
    // when a user signs up we have a pre-generated list of addresses and the user grabs the next available one and we create a wallet for them
    static generateNewWalletOnSignUp = async (userID: number) => {
        const wallets = await prisma.wallet.findMany({
            where: {
                address: {
                    in: ADDRESS_LIST,
                },
            },
        });
        let firstAddressNotInList = '';
        for (let i = 0; i < ADDRESS_LIST.length; i++) {
            const address = ADDRESS_LIST[i];
            const wallet = wallets.find(wallet => wallet.address === address);
            if (!wallet) {
                firstAddressNotInList = address;
                break;
            }
        }

        if (firstAddressNotInList === '')
            throw new Error('No address available');

        const wallet = await prisma.wallet.create({
            data: {
                userID,
                address: firstAddressNotInList,
            },
        });

        return wallet;
    }
}


export default WalletService;