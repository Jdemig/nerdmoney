/*
  Warnings:

  - You are about to drop the column `confirmations` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `TransactionInput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionOutput` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cipherText` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initVect` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "cipherText" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "initVect" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "confirmations",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "txhash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "TransactionInput";

-- DropTable
DROP TABLE "TransactionOutput";

-- CreateTable
CREATE TABLE "BtcTransaction" (
    "btcTransactionID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "addressID" INTEGER NOT NULL,
    "accountID" INTEGER NOT NULL,
    "txhash" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "confirmations" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BtcTransaction_pkey" PRIMARY KEY ("btcTransactionID")
);

-- CreateTable
CREATE TABLE "BtcTransactionInput" (
    "btcTransactionInputID" SERIAL NOT NULL,
    "transactionID" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "script" TEXT,
    "scriptType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BtcTransactionInput_pkey" PRIMARY KEY ("btcTransactionInputID")
);

-- CreateTable
CREATE TABLE "BtcTransactionOutput" (
    "btcTransactionOutputID" SERIAL NOT NULL,
    "transactionID" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "script" TEXT,
    "scriptType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BtcTransactionOutput_pkey" PRIMARY KEY ("btcTransactionOutputID")
);

-- CreateIndex
CREATE UNIQUE INDEX "BtcTransaction_txhash_key" ON "BtcTransaction"("txhash");
