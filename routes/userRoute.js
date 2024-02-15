import express from "express";
import {
  addToCart,
  applyCoupon,
  blockUser,
  createCashOrder,
  deleteOrder,
  deleteSingleUser,
  emptyCart,
  getAllOrders,
  getAllUsers,
  getOrderByUserId,
  getSingleOrder,
  getSingleUser,
  getUserCart,
  getWishlist,
  saveAddress,
  unblockUser,
  updateOrderStatus,
  updateSingleUser,
} from "../controller/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadPhoto } from "../middlewares/uploadImages.js";
//express init
const userRoute = express.Router();

// auth middleware

userRoute.use(authMiddleware);

//create routes
userRoute.route("/all").get(authMiddleware, isAdmin, getAllUsers);
userRoute.route("/block/:id").get(authMiddleware, isAdmin, blockUser);
userRoute.route("/unblock/:id").get(authMiddleware, isAdmin, unblockUser);
userRoute.route("/wishlist").get(authMiddleware, getWishlist);
userRoute.route("/address").put(authMiddleware, saveAddress);
userRoute.route("/cart").post(authMiddleware, addToCart);
userRoute.route("/cart").get(authMiddleware, getUserCart);
userRoute.route("/cart").delete(authMiddleware, emptyCart);
userRoute.route("/cart/applycoupon").post(authMiddleware, applyCoupon);
userRoute.route("/cart/cash-order").post(authMiddleware, createCashOrder);
userRoute.route("/get-order").get(authMiddleware, getSingleOrder);
userRoute.route("/get-all-orders").get(authMiddleware, isAdmin, getAllOrders);
userRoute
  .route("/get-all-orders/order/:id")
  .delete(authMiddleware, isAdmin, deleteOrder);
userRoute
  .route("/get-order-by-user/:id")
  .get(authMiddleware, isAdmin, getOrderByUserId);
userRoute
  .route("/order/update-order-status/:id")
  .put(authMiddleware, isAdmin, updateOrderStatus);
userRoute.route("/:id").get(authMiddleware, getSingleUser);
userRoute.route("/:id").delete(authMiddleware, isAdmin, deleteSingleUser);
userRoute
  .route("/:id")
  .put(authMiddleware, uploadPhoto.single("photo"), updateSingleUser);

//export user routes
export default userRoute;
