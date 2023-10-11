import prisma from "../prisma/db.ts";
import {encryptVault} from "../lib/encryption.ts";
import {generateMnemonic} from "bip39";
import AddressService from "./AddressService.ts";


class AccountService {
    static generateNewAccountOnSignUp = async (userID: number) => {
        const mnemonic = generateMnemonic();

        const vault = await encryptVault({
            vault: mnemonic,
            passwordOrSaltedKey: process.env.PRIVATE_KEY_SECRET,
            version: 1,
        });

        const account = await prisma.account.create({
            data: {
                userID,
                salt: vault.salt,
                initVect: vault.initializationVector,
                cipherText: vault.cipherText,
            }
        });

        const addressClient = await AddressService.createNewAddress(userID, account.accountID, mnemonic);

        return {
            account,
            address: addressClient,
        }
    }
}


export default AccountService;