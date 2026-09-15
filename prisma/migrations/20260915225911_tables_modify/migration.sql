/*
  Warnings:

  - You are about to drop the column `tableId` on the `comandas` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `tables` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TableStatus" ADD VALUE 'DIRTY';
ALTER TYPE "TableStatus" ADD VALUE 'MAINTENANCE';

-- DropForeignKey
ALTER TABLE "comandas" DROP CONSTRAINT "comandas_tableId_fkey";

-- DropIndex
DROP INDEX "comandas_tableId_status_idx";

-- AlterTable
ALTER TABLE "comandas" DROP COLUMN "tableId",
ADD COLUMN     "peopleCount" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "tables" DROP COLUMN "capacity",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "session_tables" (
    "comandaId" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "session_tables_pkey" PRIMARY KEY ("comandaId","tableId")
);

-- AddForeignKey
ALTER TABLE "session_tables" ADD CONSTRAINT "session_tables_comandaId_fkey" FOREIGN KEY ("comandaId") REFERENCES "comandas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_tables" ADD CONSTRAINT "session_tables_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
