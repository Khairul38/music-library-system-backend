"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArtistZodSchema = exports.createArtistZodSchema = void 0;
const zod_1 = require("zod");
exports.createArtistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required",
        }),
        email: zod_1.z.string({
            required_error: "email is required",
        }),
    }),
});
exports.updateArtistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
    }),
});
