/*
  Warnings:

  - Added the required column `name` to the `ContactForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactForm" ALTER COLUMN "phone" TYPE VARCHAR(30);

-- AlterTable
CREATE SEQUENCE event_id_seq;
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT nextval('event_id_seq');
ALTER SEQUENCE event_id_seq OWNED BY "Event"."id";
