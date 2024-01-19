"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSongZodSchema = exports.createSongZodSchema = void 0;
const zod_1 = require("zod");
exports.createSongZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "title is required",
        }),
        duration: zod_1.z.string({
            required_error: "duration is required",
        }),
        albumId: zod_1.z.string({
            required_error: "albumId is required",
        }),
        artistId: zod_1.z.string({
            required_error: "artistId is required",
        }),
    }),
});
exports.updateSongZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        duration: zod_1.z.string().optional(),
        albumId: zod_1.z.string().optional(),
        artistId: zod_1.z.string().optional(),
    }),
});
