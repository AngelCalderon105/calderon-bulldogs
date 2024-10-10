import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

const region = process.env.AWS_REGION as string | undefined;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string | undefined;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string | undefined;
const bucketName = process.env.AWS_S3_BUCKET_NAME as string | undefined;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error(
    "AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME must be set",
  );
}

const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export const s3Router = createTRPCRouter({
  getPresignedUrl: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        folderName: z.string(),
        fileType: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${input.folderName}/${input.fileName}`,
        // folder name input
        ContentType: input.fileType,
      });

      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

      const key = `${input.folderName}/${input.fileName}`

      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      await db.fileMetaData.create({
        data: {
          s3Url,
          fileType: input.fileType,
          tags: input.tags,
        },
      });

      return { presignedUrl, s3Url };
    }),

  listPhotos: publicProcedure
    .input(z.object({ folderName: z.string() }))
    .query(async ({ input }) => {
      const command = new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: `${input.folderName}/`,
        // folder name input
      });

      const { Contents } = await s3.send(command);

      const photos = Contents?.filter(
        (item) => item.Key && !item.Key.endsWith("/"),
      ).map((item) => {
        return {
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`,
          key: item.Key,
        };
      });

      return photos || [];
    }),

  deletePhoto: publicProcedure
    .input(
      z.object({
        key: z.string(), // The S3 object key for file deletion
      }),
    )
    .mutation(async ({ input }) => {
      // Step 1: Delete the file from S3
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: input.key,
      });
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${input.key}`;

      try {
        await s3.send(command); // Send the delete command to S3
      } catch (error) {
        console.error("Error deleting from S3:", error);
        return { success: false, message: "Error deleting from S3" };
      }

      // Step 2: Delete the corresponding metadata from the database
      try {
        await db.fileMetaData.delete({
          where: {
            s3Url: s3Url,
          },
        });
      } catch (error) {
        console.error("Error deleting metadata from database:", error);
        return {
          success: false,
          message: "Error deleting metadata from database",
        };
      }

      return { success: true };
    }),
});
