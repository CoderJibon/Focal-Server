import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

/**
 * @desc get all Coupon data
 * @route api/v1/coupon/all
 * @method Get
 * @access public
 */

export const getAllCoupon = asyncHandler(async (req, res) => {
  //find all Coupon
  const coupons = await Coupon.find();
  //get Coupon
  if (coupons.length > 0) {
    return res.status(200).json(coupons);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create Coupon data
 * @route api/v1/coupon
 * @method Post
 * @access protected
 */
export const createCoupon = asyncHandler(async (req, res) => {
  // get values
  const { name, expiry, discount } = req.body;

  // validations
  if (!name || !expiry || !discount) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  // email check
  const nameCheck = await Coupon.findOne({ name });

  if (nameCheck) {
    throw new Error("Coupon already exists");
  }

  // create new Coupon
  const coupon = await Coupon.create(req.body);

  //response is coupon
  res.status(201).json({ coupon, message: "Coupon created successfully" });
});

/**
 * @desc delete Coupon data
 * @route api/v1/coupon/:id
 * @method Delete
 * @access protected
 */
export const deleteCoupon = asyncHandler(async (req, res) => {
  //get the Coupon id
  const { id } = req.params;
  //find the Coupon
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw new Error("Coupon Already Delete");
  }
  //response delete the Coupon
  res.status(200).json({ message: "Coupon Delete Successful", coupon });
});

/**
 * @desc update Permission data
 * @route api/v1/coupon/:id
 * @method Put
 * @access protected
 */
export const updateCoupon = asyncHandler(async (req, res) => {
  //get the Coupon id
  const { id } = req.params;
  // get values
  const { name, expiry, discount } = req.body;

  // validations
  if (!name || !expiry || !discount) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  //find the Coupon
  const coupon = await Coupon.findById(id).exec();
  if (!coupon) {
    throw new Error("coupon not found");
  }
  //update the Coupon
  const updateCouponData = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  //response the Coupon data
  res.json({
    message: `Coupon updated successful`,
    coupon: updateCouponData,
  });
});

/**
 * @desc get Single Coupon data
 * @route api/v1/coupon/:id
 * @method Get
 * @access public
 */
export const getSingleCoupon = asyncHandler(async (req, res) => {
  //get the Coupon id
  const { id } = req.params;

  //find the Coupon
  const coupon = await Coupon.findById(id).exec();

  if (!coupon) {
    throw new Error("No Coupon found");
  }
  //response the single Coupon
  res.status(200).json({ coupon });
});
