/*
  Warnings:

  - Added the required column `published` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "published" BOOLEAN NOT NULL;
