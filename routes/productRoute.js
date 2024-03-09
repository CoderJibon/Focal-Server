import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteSingleProduct,
  getAllProducts,
  getSingleProduct,
  // productUploadImage,
  rating,
  updateProduct,
  updateProductImageDelete,
} from "../controller/productController.js";
import { uploadPhoto } from "../middlewares/uploadImages.js";

//express init
const productRoute = express.Router();

//create routes
productRoute.route("/all").get(getAllProducts);
productRoute
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    uploadPhoto.fields([{ name: "productThumbnails" }, { name: "images" }]),
    createProduct
  );

productRoute.route("/:slug").get(getSingleProduct);
productRoute.route("/:id").delete(authMiddleware, isAdmin, deleteSingleProduct);
productRoute
  .route("/:id")
  .patch(
    authMiddleware,
    isAdmin,
    uploadPhoto.fields([{ name: "productThumbnails" }, { name: "images" }]),
    updateProduct
  );

productRoute.route("/rating").put(authMiddleware, rating);
productRoute
  .route("/:id")
  .post(authMiddleware, isAdmin, updateProductImageDelete);

export default productRoute;
