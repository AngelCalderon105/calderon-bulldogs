import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from 'crypto';

// S3 client initialization
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

export const blogRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        featured: z.boolean().optional(),
        imageBase64: z.string().optional(),    // Base64-encoded image data
        imageFileName: z.string().optional(),  
        fileType: z.string().optional(),       
        tags: z.array(z.string()),             
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated.");
      }

      let imageUrl: string | undefined;

      if (input.imageBase64 && input.imageFileName && input.fileType) {
        const folder = "blog-images/";
        const fileName = `${folder}${randomUUID()}-${input.imageFileName}`; 

        // Decode Base64 to Buffer
        const imageBuffer = Buffer.from(input.imageBase64, 'base64');

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: imageBuffer,       
          ContentType: input.fileType,
        });

        await s3.send(command);

        imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
      }

      // Create the blog post in the database
      const newPost = await db.blogPost.create({
        data: {
          title: input.title,
          content: input.content,
          featured: input.featured || false,
          imageUrl: imageUrl || undefined, 
          authorId: userId,
        },
      });

      return newPost;
    }),


  listAllPosts: publicProcedure.query(async () => {
    const blogPosts = await db.blogPost.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        featured: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    return blogPosts;
  }),

  featurePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        featured: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return db.blogPost.update({
        where: { id: input.postId },
        data: { featured: input.featured },
      });
    }),

  removePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return db.blogPost.delete({
        where: { id: input.postId },
      });
    }),
});
