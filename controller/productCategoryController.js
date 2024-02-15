import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import ProductCategory from "../models/ProductCategory.js";
import { cloudDelete, cloudUpload } from "../utils/cloudinary.js";

/**
 * @desc get all product-category data
 * @route api/v1/product-category/all
 * @method Get
 * @access public
 */

export const getAllProductCategory = asyncHandler(async (req, res) => {
  //find all product-category
  const productCategory = await ProductCategory.find().populate("products");
  //get product-category
  if (productCategory.length > 0) {
    return res.status(200).json(productCategory);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create product-category data
 * @route api/v1/product-category
 * @method Post
 * @access protected
 */
export const createProductCategory = asyncHandler(async (req, res) => {
  // get values
  const { name, icon, description, products } = req.body;

  let categoryPhoto = null;
  if (req.file) {
    const catP = await cloudUpload(req.file.path);
    categoryPhoto = {
      url: catP.url,
      public_id: catP.public_id,
    };
  }

  // validations
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  // email check
  const nameCheck = await ProductCategory.findOne({ name });

  //check is exists
  if (nameCheck) {
    throw new Error(`this ${name} already exists`);
  }

  // create new product-category
  const productCategory = await ProductCategory.create({
    name,
    slug: createSlug(name),
    icon: icon ? icon : null,
    description: description ? description : null,
    photo: categoryPhoto ? categoryPhoto : null,
    products: null,
  });

  //response is product-category
  res.status(201).json({ productCategory, message: "created successfully" });
});

/**
 * @desc get Single product-category data
 * @route api/v1/product-category/:slug
 * @method Get
 * @access public
 */
export const getSingleProductCategory = asyncHandler(async (req, res) => {
  try {
    //get the product-category slug
    const { slug } = req.params;
    //find the product-category
    const productCategory = await ProductCategory.findOne({ slug });
    if (!productCategory) {
      throw new Error("No Category found");
    }
    //response the single product-category
    res.status(200).json({ productCategory });
  } catch (error) {
    throw new Error("something went wrong try to again");
  }
});

/**
 * @desc delete product-category data
 * @route api/v1/product-category/:id
 * @method Delete
 * @access protected
 */
export const deleteProductCategory = asyncHandler(async (req, res) => {
  //get the product-category id
  const { id } = req.params;
  //find the product-category
  const productCategory = await ProductCategory.findByIdAndDelete(id);
  if (!productCategory) {
    throw new Error("product cat Already Delete");
  }

  // delete cloud image
  if (productCategory.photo?.public_id) {
    await cloudDelete(productCategory.photo?.public_id);
  }

  //response delete the product-category
  res
    .status(200)
    .json({ message: "product cat Delete Successful", productCategory });
});

/**
 * @desc update Permission data
 * @route api/v1/product-category/:id
 * @method Put
 * @access protected
 */
export const updateProductCategory = asyncHandler(async (req, res) => {
  //get the product-category id
  const { id } = req.params;
  // get the form data
  const { name, icon, description, products } = req.body;

  //photo update
  let catPhoto = null;
  if (req.file) {
    const cP = await cloudUpload(req.file.path);
    catPhoto = {
      url: cP.url,
      public_id: cP.public_id,
    };
  }

  // validation
  if (!name) {
    throw new Error("product cat Name Is required");
  }
  //find the product-category
  const productCategory = await ProductCategory.findById(id).exec();
  if (!productCategory) {
    throw new Error("product cat not found");
  }

  //update images
  if (!catPhoto) {
    catPhoto = productCategory.photo;
  } else {
    if (productCategory.photo?.public_id) {
      await cloudDelete(productCategory.photo?.public_id);
    }
  }

  //update the product-category
  const updateProductCategoryData = await ProductCategory.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      icon: icon ? icon : "",
      photo: catPhoto ? catPhoto : null,
      description: description ? description : "",
      products: products ? products : [],
    },
    {
      new: true,
    }
  );
  //update the parentCategory
  // if (parentCategory) {
  //   await ProductCategory.findByIdAndUpdate(parentCategory, {
  //     $push: { subCategory: updateProductCategoryData._id },
  //   });
  // }
  //response the product-category data
  res.json({
    message: `updated successful`,
    productCategory: updateProductCategoryData,
  });
});

/**
 * @DESC update a Product category photo delete
 * @ROUTE /api/v1/product-category/image/:id
 * @METHOD put
 * @ACCESS protected
 */
export const updateCategoryImageDelete = asyncHandler(async (req, res) => {
  try {
    // get params id
    const { id } = req.params;
    // get body data
    const { imageId } = req.body;
    const pc = await ProductCategory.findById(id);

    // Find by id
    const productCat = await ProductCategory.findByIdAndUpdate(
      id,
      {
        photo: pc.photo?.public_id == imageId ? null : pc.photo,
      },
      { new: true }
    );

    //if does not available
    if (!pc) {
      throw new Error("Image Not Found!");
    }

    if (imageId) {
      await cloudDelete(imageId);
    }

    res
      .status(200)
      .json({ imageId: imageId, message: "Image Delete successfully" });
  } catch (error) {
    throw new Error("something went wrong");
  }
});
