import { z } from "zod";

export const createAlbumZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "title is required",
    }),
    releaseYear: z.string({
      required_error: "releaseYear is required",
    }),
    genre: z.string({
      required_error: "genre is required",
    }),
    artists: z.array(
      z.object({
        artistId: z.string({
          required_error: "artistId is required",
        }),
      }),
      {
        required_error: "artists is required",
      }
    ),
  }),
});

export const updateAlbumZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    releaseYear: z.string().optional(),
    genre: z.string().optional(),
    artists: z
      .array(
        z.object({
          artistId: z.string().optional(),
        })
      )
      .optional(),
  }),
});
