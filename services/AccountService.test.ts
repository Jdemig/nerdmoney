import {describe} from "@jest/globals";
import prisma from "../prisma/db.ts";
import AccountService from "./AccountService.ts";
import ECPairFactory from "ecpair";
import {decryptVault, encryptVault} from "../lib/encryption.ts";
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import {generateMnemonic, mnemonicToSeed, mnemonicToSeedSync} from 'bip39';


const tinysecp = require('tiny-secp256k1');



const ECPair = ECPairFactory(tinysecp);
const bip32 = BIP32Factory(tinysecp);


beforeAll(async () => {
    if (!process.env.DATABASE_URL.includes('localhost')) {
        // throw new Error('Not connected to the test database');
    }

    // delete all wallets if they exist
    await prisma.user.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.address.deleteMany({});
});

describe('Test the AccountService', () => {
    test('Test that you can generate a key pair', async () => {
        const keyPair1 = ECPair.makeRandom();

        const wifKey1 = keyPair1.toWIF();

        console.log(wifKey1);

        const keyPair2 = ECPair.fromWIF(wifKey1);

        const wifKey2 = keyPair2.toWIF();

        console.log(wifKey2);

        expect(wifKey1).toBe(wifKey2);
    });

    test('Test generating a new account on sign up', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'jonathan.emig@gmail.com',
            },
        });
        const account = await AccountService.generateNewAccountOnSignUp(user.userID);

        expect(account).toBeDefined();

    });


    test('Test encrypting and decrypting a vault', async () => {
        const keyPair = ECPair.makeRandom();
        const wifKey = keyPair.toWIF();

        const vault = await encryptVault({
            vault: wifKey,
            passwordOrSaltedKey: process.env.PRIVATE_KEY_SECRET,
            version: 1,
        });

        const wifKey2 = await decryptVault({
            vault,
            passwordOrSaltedKey: process.env.PRIVATE_KEY_SECRET,
            version: 1,
        });

        expect(wifKey).toBe(wifKey2);
    });


    test('Test generating a deterministic address using BIP32', async () => {
        const mnemonic = generateMnemonic();
        const seed = mnemonicToSeedSync(mnemonic);

        const root = bip32.fromSeed(seed);

        const account = root.derivePath("m/44'/0'/0'");

        const node = account.derivePath('0/0');

        const { address } = bitcoin.payments.p2wpkh({ pubkey: node.publicKey });

        const node2 = account.derivePath('0/1');

        const { address: address2 } = bitcoin.payments.p2wpkh({ pubkey: node2.publicKey });

        expect(address).not.toBe(address2);

        const seed2 = mnemonicToSeedSync(mnemonic);
        // get root from seed using bip32
        const root2 = bip32.fromSeed(seed2);

        const account2 = root2.derivePath("m/44'/0'/0'");

        const node3 = account2.derivePath('0/0');

        const { address: address3 } = bitcoin.payments.p2wpkh({ pubkey: node3.publicKey });

        expect(address).toBe(address3);
    });


    test('Test if address is same every time', async () => {
        const keyPair = ECPair.makeRandom();

        const { address: address1 } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

        const { address: address2 } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

        expect(address1).toBe(address2);
    });

});