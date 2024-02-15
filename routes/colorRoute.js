import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createColor,
  deleteColor,
  getAllColor,
  getSingleColor,
  updateColor,
} from "../controller/colorController.js";

//express init
const colorRoute = express.Router();

// routing
colorRoute.route("/all").get(getAllColor);
colorRoute.route("/").post(authMiddleware, isAdmin, createColor);
colorRoute.route("/:id").get(getSingleColor);
colorRoute.route("/:id").delete(authMiddleware, isAdmin, deleteColor);
colorRoute.route("/:id").put(authMiddleware, isAdmin, updateColor);

//export Color routes
export default colorRoute;
