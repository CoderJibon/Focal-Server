import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
} from "../controller/couponController.js";

//express init
const couponRoute = express.Router();

// routing
couponRoute.route("/all").get(authMiddleware, isAdmin, getAllCoupon);
couponRoute.route("/").post(authMiddleware, isAdmin, createCoupon);
couponRoute.route("/:id").get(getSingleCoupon);
couponRoute.route("/:id").delete(authMiddleware, isAdmin, deleteCoupon);
couponRoute.route("/:id").put(authMiddleware, isAdmin, updateCoupon);

//export Coupon routes
export default couponRoute;
