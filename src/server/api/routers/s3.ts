import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

const region = process.env.AWS_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY! ;
const bucketName = process.env.AWS_S3_BUCKET_NAME! ;

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
    .input(z.object({ fileName: z.string(), fileType: z.string(), folderName: z.string(), tags: z.string(), }))

    .mutation(async ({ input }) => {
      const folder =  `${input.folderName}/${input.tags}`
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${folder}/${input.fileName}`,
        // folder name input
        ContentType: input.fileType,
      });

      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

      const key = `${folder}/${input.fileName}`

      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      await db.fileMetaData.create({
        data: {
          s3Url,             
          fileType: input.fileType, 
          tags: Array.isArray(input.tags) ? input.tags : [input.tags],

        },
      });

      return { presignedUrl, s3Url };
    }),

    listPhotos: publicProcedure
    .input(z.object({ 
      folder: z.string(), subfolder: z.string(), tag: z.string().optional()})) // Tag input is optional
    .query(async ({ input }) => {
      const command = new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: `${input.folder}/${input.subfolder}`,

      });

      const { Contents } = await s3.send(command);

      // Get all S3 photos first
      const photos = Contents?.filter(item => item.Key && !item.Key.endsWith('/')).map((item) => {
        return {
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`,
          key: item.Key,
        };
      });


      return photos ?? [];
    }),
    getLatestPhoto: publicProcedure
    .input(z.object({ folder: z.string(), subfolder: z.string() }))
    .query(async ({ input }) => {
      const command = new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: `${input.folder}/${input.subfolder}`,
      });

      const { Contents } = await s3.send(command);

      if (!Contents || Contents.length === 0) {
        return { photo: null }; // Explicitly return null if no photo
      }

      const latestPhoto = Contents.filter(item => item.Key && !item.Key.endsWith('/'))
        .sort((a, b) => {
          const aDate = a.LastModified ? new Date(a.LastModified) : new Date(0);
          const bDate = b.LastModified ? new Date(b.LastModified) : new Date(0);
          return bDate.getTime() - aDate.getTime(); // Sort descending by date
        })[0]; 

      if (!latestPhoto) {
        return { photo: null };
      }

      const url = `https://${bucketName}.s3.${region}.amazonaws.com/${latestPhoto.Key}`;
      return { photo: { url, key: latestPhoto.Key } };
    }),


  deletePhoto: publicProcedure
    .input(
      z.object({
        key: z.string(), 
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
    deleteAllPuppyPhotos: publicProcedure
    .input(
      z.object({
        folder: z.string(), // The S3 folder/prefix to delete (e.g., "puppy_galleries/puppy_name_gallery")
      })
    )
    .mutation(async ({ input }) => {
      const { folder } = input;

      // Step 1: List all objects in the folder
      const listCommand = new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: folder, // Prefix to match all objects in the folder
      });

      const { Contents } = await s3.send(listCommand);

      if (!Contents || Contents.length === 0) {
        return { success: true, message: "No images found to delete." };
      }

      // Extract the keys of all objects to delete
      const keysToDelete = Contents.map((item) => ({ Key: item.Key! }));

      // Step 2: Delete all objects in the folder
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: keysToDelete,
        },
      });

      try {
        await s3.send(deleteCommand);
      } catch (error) {
        console.error("Error deleting S3 objects:", error);
        return { success: false, message: "Failed to delete S3 objects." };
      }

      // Step 3: Delete metadata for these files from the database
      try {
        await db.fileMetaData.deleteMany({
          where: {
            s3Url: {
              in: keysToDelete.map(
                (key) =>
                  `https://${bucketName}.s3.${region}.amazonaws.com/${key.Key}`
              ),
            },
          },
        });
      } catch (error) {
        console.error("Error deleting metadata from database:", error);
        return {
          success: false,
          message: "Failed to delete file metadata from the database.",
        };
      }

      return { success: true, message: "Gallery and metadata deleted successfully." };
    }),
});
    
