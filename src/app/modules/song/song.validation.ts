import { z } from "zod";

export const createSongZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "title is required",
    }),
    duration: z.string({
      required_error: "duration is required",
    }),
    albumId: z.string({
      required_error: "albumId is required",
    }),
    artistId: z.string({
      required_error: "artistId is required",
    }),
  }),
});

export const updateSongZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    duration: z.string().optional(),
    albumId: z.string().optional(),
    artistId: z.string().optional(),
  }),
});
