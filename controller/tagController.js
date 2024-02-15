import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import Tag from "../models/Tag.js";
/**
 * @desc get all Tag data
 * @route api/v1/tag/all
 * @method Get
 * @access PUBLIC
 */
export const getAllTag = asyncHandler(async (req, res) => {
  //find  all tags
  const tags = await Tag.find();
  if (tags.length > 0) {
    res.status(200).json(tags);
  }
  res.status(200).json([]);
});

/**
 * @desc create a tag
 * @route api/v1/tag
 * @method post
 * @access protected
 */

export const createTag = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "Tag name is required" });
  }
  // email check
  const nameCheck = await Tag.findOne({ name });

  if (nameCheck) {
    return res.status(400).json({ message: "Tag already exists" });
  }

  // create new Tag
  const tag = await Tag.create({
    name,
    slug: createSlug(name),
  });

  res.status(200).json({ tag, message: "Tag created successfully" });
});

/**
 * @desc get a single tag
 * @route api/v1/tag/:id
 * @method get
 * @access public
 */

export const getSingleTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findById(id);
    res.status(200).json(tag);
  } catch (error) {
    throw new Error("Tag is not found");
  }
});

/**
 * @desc delete a single tag
 * @route api/v1/tag/:id
 * @method delete
 * @access protected
 */

export const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findByIdAndDelete(id);

  if (!tag) {
    return res.status(400).json({ message: "Tag delete failed" });
  }

  res.json({ message: "Tag Delete Successful", tag });
});

/**
 * @desc update a tag
 * @route api/v1/tag/:id
 * @method put
 * @access protected
 */

export const updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name } = req.body;

  // validation
  if (!name) {
    return res.status(400).json({ message: "Tag Name Is required" });
  }

  const tag = await Tag.findById(id).exec();

  if (!tag) {
    return res.status(400).json({ message: "Tag not found" });
  }

  const updateTagData = await Tag.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
    },
    {
      new: true,
    }
  );

  res.json({
    message: `Tag updated successful`,
    tag: updateTagData,
  });
});

/**
 * @desc update Tag Status
 * @route PUT /tag/status/:id
 * @access PUBLIC
 */

export const updateTagStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const updateTagStatus = await Tag.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    {
      new: true,
    }
  );

  res.json({
    message: `Tag Status updated successful`,
    tag: updateTagStatus,
  });
});
