import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import Color from "../models/Color.js";

/**
 * @desc get all Color data
 * @route api/v1/color/all
 * @method Get
 * @access protected
 */

export const getAllColor = asyncHandler(async (req, res) => {
  //find all color
  const colors = await Color.find();
  //get Color
  if (colors.length > 0) {
    return res.status(200).json(colors);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create Color data
 * @route api/v1/Color
 * @method Post
 * @access protected
 */
export const createColor = asyncHandler(async (req, res) => {
  // get values
  const { name, colorCode } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "Color name is required" });
  }
  // email check
  const nameCheck = await Color.findOne({ name });

  if (nameCheck) {
    throw new Error("Color already exists");
  }

  // create new Color
  const color = await Color.create({
    name,
    slug: createSlug(name),
    colorCode: colorCode,
  });
  //response is Color
  res.status(201).json({ color, message: `${name} create successfully` });
});

/**
 * @desc get Single Color data
 * @route api/v1/Color/:id
 * @method Get
 * @access public
 */
export const getSingleColor = asyncHandler(async (req, res) => {
  //get the Color id
  const { id } = req.params;

  try {
    //find the Color
    const color = await Color.findById(id);
    if (!color) {
      throw new Error("No Color found");
    }
    //response the single Color
    res.status(200).json({ color });
  } catch (error) {
    throw new Error("No Color found");
  }
});

/**
 * @desc delete Color data
 * @route api/v1/Color/:id
 * @method Delete
 * @access protected
 */
export const deleteColor = asyncHandler(async (req, res) => {
  //get the Color id
  const { id } = req.params;
  //find the Color
  const color = await Color.findByIdAndDelete(id);
  if (!color) {
    throw new Error("Color Already Delete");
  }
  //response delete the Color
  res.status(200).json({ message: "Color Delete Successful", color });
});

/**
 * @desc update Permission data
 * @route api/v1/Color/:id
 * @method Put
 * @access protected
 */
export const updateColor = asyncHandler(async (req, res) => {
  //get the Color id
  const { id } = req.params;
  // get the form data
  const { name, colorCode } = req.body;
  // validation
  if (!name) {
    throw new Error("Color Name Is required");
  }
  //find the Color
  const color = await Color.findById(id).exec();
  if (!color) {
    throw new Error("Color not found");
  }
  //update the Color
  const updateColorData = await Color.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      colorCode,
    },
    {
      new: true,
    }
  );
  //response the Color data
  res.json({
    message: `Color updated successful`,
    color: updateColorData,
  });
});
