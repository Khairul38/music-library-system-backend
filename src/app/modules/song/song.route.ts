import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createSong,
  deleteSingleSong,
  getAllSong,
  getSingleSong,
  updateSingleSong,
} from "./song.controller";
import { createSongZodSchema, updateSongZodSchema } from "./song.validation";

const router = express.Router();

router.post(
  "/create-song",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(createSongZodSchema),
  createSong
);

router.get("/", auth(ENUM_USER_ROLE.USER), getAllSong);

router.get("/:id", auth(ENUM_USER_ROLE.USER), getSingleSong);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(updateSongZodSchema),
  updateSingleSong
);

router.delete("/:id", auth(ENUM_USER_ROLE.USER), deleteSingleSong);

export const SongRoutes = router;
