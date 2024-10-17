/*
  Warnings:

  - Added the required column `name` to the `ContactForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactForm" ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(30);

-- AlterTable
CREATE SEQUENCE event_id_seq;
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT nextval('event_id_seq');
ALTER SEQUENCE event_id_seq OWNED BY "Event"."id";
