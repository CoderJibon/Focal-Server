import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import createSlug from "../utils/createSlug.js";
import { APP_ENV } from "../utils/secret.js";
import { generateToken } from "../helper/jwtToken.js";
import crypto from "crypto";
import { forgetPasswordEmail } from "../utils/sendMail.js";

/**
 * @DESC create a new user
 * @ROUTE api/v1/user/register
 * @METHOD POST
 * @ACCESS public
 */
export const registerUser = asyncHandler(async (req, res) => {
  // get body data
  const { firstName, lastName, email, password } = req.body;

  // is empty
  if (!firstName || !lastName || !email || !password) {
    throw new Error("all fields are required");
  }
  try {
    // find user
    const user = await User.findOne({ email });

    //if Email is already exists
    if (user) {
      throw new Error("Email already exists");
    }

    //password make hash
    const hashPassword = bcrypt.hashSync(password, 10);

    //create new user
    const newUser = await User.create({
      firstName,
      lastName,
      slug: createSlug(firstName + "-" + lastName),
      email,
      password: hashPassword,
    });

    // response
    res
      .status(201)
      .json({ user: newUser, message: "Registration successfully" });
  } catch (error) {
    throw new Error("Email already exists");
  }
});

/**
 * @DESC Login user with username and password
 * @ROUTE api/v1/user/login
 * @METHOD POST
 * @ACCESS public
 */

export const userLogin = asyncHandler(async (req, res) => {
  //get body data
  const { email, password } = req.body;
  // is empty
  if (!email || !password) {
    throw new Error("all fields are required");
  }
  //find user by email
  const user = await User.findOne({ email });

  //check if user
  if (!user) {
    throw new Error("User not found");
  }

  //password checked
  if (bcrypt.compareSync(password, user.password) === false) {
    throw new Error("invalid credentials");
  }

  //with out password from user
  const userData = await User.findOne({ email }).select("-password");

  //Token Generated
  const accessToken = generateToken(user._id);

  //set cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  //response
  res.status(200).json({ user: userData, message: "Login Success" });
});

/**
 * @DESC Login admin with username and password
 * @ROUTE api/v1/user/login
 * @METHOD POST
 * @ACCESS public
 */

export const adminLogin = asyncHandler(async (req, res) => {
  //get body data
  const { email, password } = req.body;
  // is empty
  if (!email || !password) {
    throw new Error("all fields are required");
  }
  //find admin by email
  const admin = await User.findOne({ email });

  //check if admin
  if (!admin) {
    throw new Error("User not found");
  }
  if (admin.role !== "admin") {
    throw new Error("Not Authorized");
  }
  //password checked
  if (bcrypt.compareSync(password, admin.password) === false) {
    throw new Error("invalid credentials");
  }

  //with out password from user
  const adminData = await User.findOne({ email }).select("-password");

  //Token Generated
  const accessToken = generateToken(admin._id);

  //set cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  //response
  res.status(200).json({ admin: adminData, message: "Login Success" });
});

/**
 * @DESC logged in admin
 * @ROUTE /api/v1/auth/logged-in-admin
 * @method get
 * @access public
 */
export const loggedInAdmin = asyncHandler(async (req, res) => {
  res.status(200).json(req.me);
});

/**
 * @DESC logged in user
 * @ROUTE /api/v1/auth/logged-in-user
 * @method get
 * @access public
 */
export const loggedInUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.me);
});

/**
 * @DESC logout user
 * @ROUTE /api/v1/auth/logout
 * @method get
 * @access public
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
});

/**
 * @DESC Updated password
 * @ROUTE api/v1/user/updatePassword
 * @METHOD POST
 * @ACCESS protected
 */
export const updatePassword = asyncHandler(async (req, res) => {
  // get body data
  const { oldPassword, password } = req.body;
  //get user email
  const { email } = req.me;
  // check field is empty
  if (!oldPassword || !password) {
    throw new Error("all field are required!");
  }
  // got the valid user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid user");
  }
  //check old password is correct
  if (bcrypt.compareSync(oldPassword, user.password) === false) {
    throw new Error("Old Password is incorrect");
  }
  //password make hash
  const hashPassword = bcrypt.hashSync(password, 10);

  //update new password
  await User.findByIdAndUpdate(user._id, { password: hashPassword });
  //response update
  res.status(200).json({ message: "Password updated successfully" });
});

/**
 * @DESC forgotPasswordToken
 * @ROUTE api/v1/user/forgotPasswordToken
 * @METHOD POST
 * @ACCESS public
 */
export const forgotPasswordToken = asyncHandler(async (req, res) => {
  // get body data
  const { email } = req.body;

  // check field is empty
  if (!email) {
    throw new Error("Email is required!");
  }
  // got the valid user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("user Not found!");
  }
  // generate random Token
  const secret = crypto.randomBytes(32).toString("hex");
  // generate password reset token
  const resetToken = crypto.createHash("sha256").update(secret).digest("hex");
  // generate token Expire
  const expireToken = Date.now() + 10 * 60 * 1000; // 10 minutes
  // update token
  await User.findByIdAndUpdate(user._id, {
    passwordResetToken: resetToken,
    passwordResetExpires: expireToken,
  });

  //send mail
  const sendMail = forgetPasswordEmail({
    to: user.email,
    name: `${user.firstName} ${user.lastName}`,
    token: `http://localhost:3000/reset-password/${resetToken}`,
  });
  // user responsive
  res.status(200).json({ message: "Forgot password mail Send" });
});

/**
 * @DESC resetPassword
 * @ROUTE api/v1/user/resetPassword
 * @METHOD POST
 * @ACCESS public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  // get body data
  const { token } = req.params;
  if (!token) {
    throw new Error("Invalid token");
  }
  // get body data
  const { password } = req.body;
  // check field is empty
  if (!password) {
    throw new Error("Password Field must not be empty!");
  }
  // check token is valid
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token is Expired try to again");
  }
  //password make hash
  const hashPassword = bcrypt.hashSync(password, 10);
  //update password
  user.password = hashPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.passwordChangedAt = Date.now();
  user.verify = true;
  await user.save();
  // user responsive
  res.status(200).json({ message: "password reset done" });
});
