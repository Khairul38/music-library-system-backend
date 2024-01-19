import { z } from "zod";

export const createArtistZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
  }),
});

export const updateArtistZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
  }),
});
