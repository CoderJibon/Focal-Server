import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBlogCategory,
  deleteBlogCategory,
  getAllBlogCategory,
  getSingleBlogCategory,
  updateBlogCategory,
} from "../controller/blogCategoryController.js";

//express init
const blogCategoryRoute = express.Router();

// routing
blogCategoryRoute.route("/all").get(getAllBlogCategory);
blogCategoryRoute.route("/").post(authMiddleware, isAdmin, createBlogCategory);
blogCategoryRoute.route("/:slug").get(getSingleBlogCategory);
blogCategoryRoute
  .route("/:id")
  .delete(authMiddleware, isAdmin, deleteBlogCategory);
blogCategoryRoute
  .route("/:id")
  .put(authMiddleware, isAdmin, updateBlogCategory);

//export blog category routes
export default blogCategoryRoute;
