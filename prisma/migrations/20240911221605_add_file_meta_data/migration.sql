-- CreateTable
CREATE TABLE "FileMetaData" (
    "id" SERIAL NOT NULL,
    "s3Url" TEXT NOT NULL,
    "tags" TEXT[],
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,

    CONSTRAINT "FileMetaData_pkey" PRIMARY KEY ("id")
);
