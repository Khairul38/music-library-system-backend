import express from "express";
import { AlbumRoutes } from "../modules/album/album.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/albums",
    route: AlbumRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
