import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  updateBrandImageDelete,
} from "../controller/brandController.js";
import { uploadPhoto } from "../middlewares/uploadImages.js";

//express init
const brandRoute = express.Router();

// routing
brandRoute.route("/all").get(getAllBrand);
brandRoute
  .route("/")
  .post(authMiddleware, isAdmin, uploadPhoto.single("photo"), createBrand);
brandRoute.route("/:id").get(getSingleBrand);
brandRoute.route("/:id").delete(authMiddleware, isAdmin, deleteBrand);
brandRoute
  .route("/image/:id")
  .put(authMiddleware, isAdmin, updateBrandImageDelete);
brandRoute
  .route("/:id")
  .put(authMiddleware, isAdmin, uploadPhoto.single("photo"), updateBrand);

//export brand routes
export default brandRoute;
