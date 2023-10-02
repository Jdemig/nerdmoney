/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userID_fkey";

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "address" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "walletID" INTEGER NOT NULL,
    "txhash" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "confirmations" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionID")
);

-- CreateTable
CREATE TABLE "TransactionInput" (
    "transactionInputID" SERIAL NOT NULL,
    "transactionID" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "script" TEXT NOT NULL,
    "scriptType" TEXT NOT NULL,

    CONSTRAINT "TransactionInput_pkey" PRIMARY KEY ("transactionInputID")
);

-- CreateTable
CREATE TABLE "TransactionOutput" (
    "transactionOutputID" SERIAL NOT NULL,
    "transactionID" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "script" TEXT NOT NULL,
    "scriptType" TEXT NOT NULL,

    CONSTRAINT "TransactionOutput_pkey" PRIMARY KEY ("transactionOutputID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txhash_key" ON "Transaction"("txhash");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");
