import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createArtist,
  deleteSingleArtist,
  getAllArtist,
  getSingleArtist,
  updateSingleArtist,
} from "./artist.controller";
import {
  createArtistZodSchema,
  updateArtistZodSchema,
} from "./artist.validation";

const router = express.Router();

router.post(
  "/create-artist",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(createArtistZodSchema),
  createArtist
);

router.get("/", auth(ENUM_USER_ROLE.USER), getAllArtist);

router.get("/:id", auth(ENUM_USER_ROLE.USER), getSingleArtist);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(updateArtistZodSchema),
  updateSingleArtist
);

router.delete("/:id", auth(ENUM_USER_ROLE.USER), deleteSingleArtist);

export const ArtistRoutes = router;
