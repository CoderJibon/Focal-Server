import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import BlogCategory from "../models/BlogCategory.js";

/**
 * @desc get all blog-category data
 * @route api/v1/blog-category/all
 * @method Get
 * @access public
 */

export const getAllBlogCategory = asyncHandler(async (req, res) => {
  //find all blog-category
  const blogCategory = await BlogCategory.find();
  //get blog-category
  if (blogCategory.length > 0) {
    return res.status(200).json(blogCategory);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create blog-category data
 * @route api/v1/blog-category
 * @method Post
 * @access protected
 */
export const createBlogCategory = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "Blog cat name is required" });
  }
  // email check
  const nameCheck = await BlogCategory.findOne({ name });

  if (nameCheck) {
    throw new Error("Blog cat already exists");
  }

  // create new blog-category
  const blogCategory = await BlogCategory.create({
    name,
    slug: createSlug(name),
  });
  //response is blog-category
  res
    .status(201)
    .json({ blogCategory, message: "Blog cat created successfully" });
});

/**
 * @desc get Single blog-category data
 * @route api/v1/blog-category/:id
 * @method Get
 * @access public
 */
export const getSingleBlogCategory = asyncHandler(async (req, res) => {
  //get the blog-category slug
  const { slug } = req.params;
  //find the blog-category
  const blogCategory = await BlogCategory.findOne({ slug });
  if (!blogCategory) {
    throw new Error("No Category found");
  }
  //response the single blog-category
  res.status(200).json({ blogCategory });
});

/**
 * @desc delete blog-category data
 * @route api/v1/blog-category/:id
 * @method Delete
 * @access protected
 */
export const deleteBlogCategory = asyncHandler(async (req, res) => {
  //get the blog-category id
  const { id } = req.params;
  //find the blog-category
  const blogCategory = await BlogCategory.findByIdAndDelete(id);
  if (!blogCategory) {
    throw new Error("Blog cat Already Delete");
  }
  //response delete the blog-category
  res.status(200).json({ message: "Blog cat Delete Successful", blogCategory });
});

/**
 * @desc update Permission data
 * @route api/v1/blog-category/:id
 * @method Put
 * @access protected
 */
export const updateBlogCategory = asyncHandler(async (req, res) => {
  //get the blog-category id
  try {
    const { id } = req.params;

    // get the form data
    const { name } = req.body;

    // validation
    if (!name) {
      throw new Error("Blog cat Name Is required");
    }
    //find the blog-category
    const blogCategory = await BlogCategory.findById(id).exec();
    if (!blogCategory) {
      throw new Error("Blog cat not found");
    }
    //update the blog-category
    const updateBlogCategoryData = await BlogCategory.findByIdAndUpdate(
      id,
      {
        name,
        slug: createSlug(name),
      },
      {
        new: true,
      }
    );
    //response the blog-category data
    res.json({
      message: `Blog cat updated successful`,
      blogCategory: updateBlogCategoryData,
    });
  } catch (error) {
    throw new Error("Already Taken");
  }
});
