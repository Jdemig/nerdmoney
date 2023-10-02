-- AlterTable
ALTER TABLE "TransactionInput" ALTER COLUMN "script" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TransactionOutput" ALTER COLUMN "script" DROP NOT NULL;
