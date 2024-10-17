/*
  Warnings:

  - Added the required column `name` to the `ContactForm` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('ONE', 'ONE_HALF', 'TWO', 'TWO_HALF', 'THREE', 'THREE_HALF', 'FOUR', 'FOUR_HALF', 'FIVE');

-- AlterTable
ALTER TABLE "ContactForm" ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(30);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rating" "Rating" NOT NULL,
    "comment" TEXT NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);
