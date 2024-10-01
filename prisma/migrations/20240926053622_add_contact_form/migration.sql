-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('GENERAL', 'STUD', 'PURCHASE');

-- CreateTable
CREATE TABLE "ContactForm" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" INTEGER NOT NULL,
    "type" "ContactType" NOT NULL,
    "body" VARCHAR(2000) NOT NULL,

    CONSTRAINT "ContactForm_pkey" PRIMARY KEY ("id")
);
