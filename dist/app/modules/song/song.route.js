"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const song_controller_1 = require("./song.controller");
const song_validation_1 = require("./song.validation");
const router = express_1.default.Router();
router.post("/create-song", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(song_validation_1.createSongZodSchema), song_controller_1.createSong);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), song_controller_1.getAllSong);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), song_controller_1.getSingleSong);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(song_validation_1.updateSongZodSchema), song_controller_1.updateSingleSong);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), song_controller_1.deleteSingleSong);
exports.SongRoutes = router;
