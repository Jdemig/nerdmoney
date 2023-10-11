/*
  Warnings:

  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountID` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "accountID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Wallet";

-- CreateTable
CREATE TABLE "Account" (
    "accountID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountID")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "address" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_address_key" ON "Address"("address");
