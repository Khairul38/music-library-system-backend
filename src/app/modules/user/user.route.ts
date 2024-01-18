import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  deleteSingleUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
} from "./user.controller";
import { updateUserZodSchema } from "./user.validation";

const router = express.Router();

router.get("/", auth(ENUM_USER_ROLE.USER), getAllUser);

router.get("/:id", auth(ENUM_USER_ROLE.USER), getSingleUser);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(updateUserZodSchema),
  updateSingleUser
);

router.delete("/:id", auth(ENUM_USER_ROLE.USER), deleteSingleUser);

export const UserRoutes = router;
