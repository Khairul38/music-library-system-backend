"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const album_controller_1 = require("./album.controller");
const album_validation_1 = require("./album.validation");
const router = express_1.default.Router();
router.post("/create-album", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(album_validation_1.createAlbumZodSchema), album_controller_1.createAlbum);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), album_controller_1.getAllAlbum);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), album_controller_1.getSingleAlbum);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(album_validation_1.updateAlbumZodSchema), album_controller_1.updateSingleAlbum);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), album_controller_1.deleteSingleAlbum);
exports.AlbumRoutes = router;
