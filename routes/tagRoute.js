import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createTag,
  deleteTag,
  getAllTag,
  getSingleTag,
  updateTag,
} from "../controller/tagController.js";

// create router
const tagRouter = express.Router();

// routing
tagRouter.route("/all").get(getAllTag);
tagRouter.route("/").post(authMiddleware, isAdmin, createTag);
tagRouter.route("/:id").get(getSingleTag);
tagRouter.route("/:id").delete(authMiddleware, isAdmin, deleteTag);
tagRouter.route("/:id").put(authMiddleware, isAdmin, updateTag);

// export router
export default tagRouter;
