"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const album_route_1 = require("../modules/album/album.route");
const artist_route_1 = require("../modules/artist/artist.route");
const auth_route_1 = require("../modules/auth/auth.route");
const song_route_1 = require("../modules/song/song.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/albums",
        route: album_route_1.AlbumRoutes,
    },
    {
        path: "/artists",
        route: artist_route_1.ArtistRoutes,
    },
    {
        path: "/songs",
        route: song_route_1.SongRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
