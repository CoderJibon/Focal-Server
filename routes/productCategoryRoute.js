import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategory,
  getSingleProductCategory,
  updateCategoryImageDelete,
  updateProductCategory,
} from "../controller/productCategoryController.js";
import { uploadPhoto } from "../middlewares/uploadImages.js";

//express init
const productCatRoute = express.Router();

// routing
productCatRoute.route("/all").get(getAllProductCategory);
productCatRoute
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    uploadPhoto.single("photo"),
    createProductCategory
  );
productCatRoute.route("/:slug").get(getSingleProductCategory);
productCatRoute
  .route("/:id")
  .delete(authMiddleware, isAdmin, deleteProductCategory);
productCatRoute
  .route("/:id")
  .put(
    authMiddleware,
    isAdmin,
    uploadPhoto.single("photo"),
    updateProductCategory
  );
productCatRoute
  .route("/image/:id")
  .put(authMiddleware, isAdmin, updateCategoryImageDelete);

//export product category routes
export default productCatRoute;
