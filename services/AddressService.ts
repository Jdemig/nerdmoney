import prisma from "../prisma/db.ts";
import {mnemonicToSeedSync} from "bip39";
import BIP32Factory from "bip32";
import tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";

const bip32 = BIP32Factory(tinysecp);

class AddressService {

    static async createNewAddress(userID: number, accountID: number, mnemonic: string) {
        const seed = mnemonicToSeedSync(mnemonic);
        const root = bip32.fromSeed(seed);
        const acct = root.derivePath("m/44'/0'/0'");


        const addresses = await prisma.address.findMany({
            where: {
                userID,
                accountID,
            },
        });

        const node = acct.derivePath(`0/${addresses.length}`);

        const { address } = bitcoin.payments.p2wpkh({ pubkey: node.publicKey });

        const addressClient = await prisma.address.create({
            data: {
                userID,
                accountID,
                address,
            },
        });

        return addressClient;

    }
}


export default AddressService;