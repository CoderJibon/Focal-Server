import asyncHandler from "express-async-handler";
import { verifyToken } from "../helper/jwtToken.js";
import User from "../models/User.js";
// create a auth middleware
export const authMiddleware = asyncHandler(async (req, res, next) => {
  //verify the Token
  try {
    //get a cookie
    const accessToken = req?.cookies?.accessToken;
    //check if the cookie
    if (!accessToken) {
      throw new Error("unAuthorized Token Is Invalid");
    }
    const decoded = verifyToken(accessToken);
    //if get user data
    const user = await User.findById(decoded.id).select("-password");
    req.me = user;
    next();
  } catch (error) {
    res.clearCookie("accessToken");
    throw new Error("unAuthorized Token Is Expired! please login again");
  }
});

//is admin middleware
export const isAdmin = (req, res, next) => {
  try {
    //get valid user
    const user = req.me;
    if (!user) {
      throw new Error("Your are not Authorized");
    }
    //check admin
    if (user.role !== "admin") {
      throw new Error("Your Are Not a Admin!");
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
