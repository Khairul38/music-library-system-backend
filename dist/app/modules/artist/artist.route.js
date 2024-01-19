"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const artist_controller_1 = require("./artist.controller");
const artist_validation_1 = require("./artist.validation");
const router = express_1.default.Router();
router.post("/create-artist", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(artist_validation_1.createArtistZodSchema), artist_controller_1.createArtist);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), artist_controller_1.getAllArtist);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), artist_controller_1.getSingleArtist);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(artist_validation_1.updateArtistZodSchema), artist_controller_1.updateSingleArtist);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), artist_controller_1.deleteSingleArtist);
exports.ArtistRoutes = router;
