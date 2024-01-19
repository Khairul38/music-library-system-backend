import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createAlbum,
  deleteSingleAlbum,
  getAllAlbum,
  getSingleAlbum,
  updateSingleAlbum,
} from "./album.controller";
import { createAlbumZodSchema, updateAlbumZodSchema } from "./album.validation";

const router = express.Router();

router.post(
  "/create-album",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(createAlbumZodSchema),
  createAlbum
);

router.get("/", auth(ENUM_USER_ROLE.USER), getAllAlbum);

router.get("/:id", auth(ENUM_USER_ROLE.USER), getSingleAlbum);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(updateAlbumZodSchema),
  updateSingleAlbum
);

router.delete("/:id", auth(ENUM_USER_ROLE.USER), deleteSingleAlbum);

export const AlbumRoutes = router;
