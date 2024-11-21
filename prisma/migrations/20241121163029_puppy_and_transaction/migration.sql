/*
  Warnings:

  - The `status` column on the `Puppy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `breed` to the `Puppy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateAvailable` to the `Puppy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Puppy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Puppy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PuppyStatus" AS ENUM ('Available', 'Reserved', 'Sold');

-- CreateEnum
CREATE TYPE "PuppySex" AS ENUM ('Male', 'Female', 'Non_Specified');

-- CreateEnum
CREATE TYPE "PersonalityTrait" AS ENUM ('calm', 'shy', 'happy', 'lazy', 'energetic', 'playful', 'curious', 'intelligent', 'friendly', 'protective');

-- AlterTable
CREATE SEQUENCE event_id_seq;
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT nextval('event_id_seq');
ALTER SEQUENCE event_id_seq OWNED BY "Event"."id";

-- AlterTable
ALTER TABLE "Puppy" ADD COLUMN     "breed" TEXT NOT NULL,
ADD COLUMN     "dateAvailable" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "personality" "PersonalityTrait"[],
ADD COLUMN     "sex" "PuppySex" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PuppyStatus" NOT NULL DEFAULT 'Available';

-- DropTable
DROP TABLE "Testimonial";

-- DropEnum
DROP TYPE "Rating";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "paypalCustomerId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "appointmentDate" TIMESTAMP(3),
    "puppyId" INTEGER,
    "transactionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_puppyId_fkey" FOREIGN KEY ("puppyId") REFERENCES "Puppy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
