import { z } from "zod";

export const photoSchema = z.object({
  _id: z.string(),
  image: z.string(), // URL de Cloudinary
  publicId: z.string().optional(),
  createdAt: z.string(),
});

export const getPhotosResponse = z.object({
  photos: z.array(photoSchema),
});

export const createPhotoResponse = z.object({
  message: z.string(),
  photo: photoSchema,
});

export const deletePhotoResponse = z.object({
  message: z.string(),
  photo: photoSchema,
});
