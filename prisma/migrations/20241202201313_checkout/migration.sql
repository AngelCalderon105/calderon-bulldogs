/*
  Warnings:

  - You are about to drop the column `paypalCustomerId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `formattedDetails` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "formattedDetails" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Puppy" ADD COLUMN     "reservedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paypalCustomerId",
ADD COLUMN     "paymentType" TEXT NOT NULL,
ADD COLUMN     "reservedUntil" TIMESTAMP(3);
