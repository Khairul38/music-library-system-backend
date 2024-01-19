"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAlbumZodSchema = exports.createAlbumZodSchema = void 0;
const zod_1 = require("zod");
exports.createAlbumZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "title is required",
        }),
        releaseYear: zod_1.z.string({
            required_error: "releaseYear is required",
        }),
        genre: zod_1.z.string({
            required_error: "genre is required",
        }),
        artists: zod_1.z.array(zod_1.z.object({
            artistId: zod_1.z.string({
                required_error: "artistId is required",
            }),
        }), {
            required_error: "artists is required",
        }),
    }),
});
exports.updateAlbumZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        releaseYear: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        artists: zod_1.z
            .array(zod_1.z.object({
            artistId: zod_1.z.string().optional(),
        }))
            .optional(),
    }),
});
