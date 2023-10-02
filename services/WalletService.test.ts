import {describe} from "@jest/globals";
import prisma from "../lib/db.ts";
import WalletService from "./WalletService.ts";
import {ADDRESS_LIST} from "../lib/addresses.ts";

beforeAll(async () => {
    if (!process.env.DATABASE_URL.includes('localhost')) {
        // throw new Error('Not connected to the test database');
    }

    // delete all wallets if they exist
    await prisma.user.deleteMany({});
    await prisma.wallet.deleteMany({});
});

describe('Test the WalletService', () => {
    test('Test generating a new wallet on sign up', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'jonathan.emig@gmail.com',
            },
        });
        const wallet = await WalletService.generateNewWalletOnSignUp(user.userID);

        expect(wallet.address).toBeDefined();
        expect(wallet.address).toBe(ADDRESS_LIST[0]);
    });

    test('Test generating a second wallet takes the next available address', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'jason@gmail.com',
            },
        });
        const wallet = await WalletService.generateNewWalletOnSignUp(user.userID);

        expect(wallet.address).toBeDefined();
        expect(wallet.address).toBe(ADDRESS_LIST[1]);
    });
});