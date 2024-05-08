import { db } from "@/lib/db";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await getAuthUserDetail();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.media.create({
        data: {
          imageUrl: file.url,
          type: file.type,
          name: file.name,
          userId: metadata.userId,
          key: file.key,
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
