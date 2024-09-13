/*
  Warnings:

  - A unique constraint covering the columns `[s3Url]` on the table `FileMetaData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileMetaData_s3Url_key" ON "FileMetaData"("s3Url");
