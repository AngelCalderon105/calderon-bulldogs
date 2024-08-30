import { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const region = process.env.AWS_REGION as string | undefined;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string | undefined;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string | undefined;
const bucketName = process.env.AWS_S3_BUCKET_NAME as string | undefined;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME must be set");
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
    .input(z.object({ fileName: z.string(), fileType: z.string() }))
    .mutation(async ({ input }) => {
      const folder = "photos/";
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${folder}${input.fileName}`,
        ContentType: input.fileType,
      });

      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return { presignedUrl };
    }),

  listPhotos: publicProcedure.query(async () => {
    const command = new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: "photos/",
    });

    const { Contents } = await s3.send(command);

    const photos = Contents?.filter(item => item.Key && !item.Key.endsWith('/')).map((item) => {
      return {
        url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`,
        key: item.Key,
      };
    });

    return photos || [];
  }),

  deletePhoto: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: input.key,
      });

      await s3.send(command);
      return { success: true };
    }),
});
