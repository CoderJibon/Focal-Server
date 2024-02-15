import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import Enquire from "../models/Enquiry.js";

/**
 * @desc get all Enquire data
 * @route api/v1/enquire/all
 * @method Get
 * @access public
 */

export const getAllEnquire = asyncHandler(async (req, res) => {
  //find all Enquire
  const enquires = await Enquire.find();
  //get Enquire
  if (enquires.length > 0) {
    return res.status(200).json(enquires);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create Enquire data
 * @route api/v1/enquire
 * @method Post
 * @access protected
 */
export const createEnquire = asyncHandler(async (req, res) => {
  // get values
  const { name, email, mobile, comment } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: `name is required` });
  }

  // create new Enquire
  const enquire = await Enquire.create({
    name,
    slug: createSlug(name),
    email,
    mobile,
    comment,
  });
  //response is Enquire
  res.status(201).json({ enquire, message: "Submit successfully" });
});

/**
 * @desc get Single Enquire data
 * @route api/v1/enquire/:id
 * @method Get
 * @access public
 */
export const getSingleEnquire = asyncHandler(async (req, res) => {
  //get the Enquire id
  const { id } = req.params;
  //find the Enquire
  const enquire = await Enquire.findById(id);
  if (!enquire) {
    throw new Error("No Enquire found");
  }
  //response the single Enquire
  res.status(200).json({ enquire });
});

/**
 * @desc delete Enquire data
 * @route api/v1/Enquire/:id
 * @method Delete
 * @access protected
 */
export const deleteEnquire = asyncHandler(async (req, res) => {
  //get the Enquire id
  const { id } = req.params;
  //find the Enquire
  const enquire = await Enquire.findByIdAndDelete(id);
  if (!enquire) {
    throw new Error("Enquire Already Delete");
  }
  //response delete the Enquire
  res.status(200).json({ message: "Enquire Delete Successful", enquire });
});

/**
 * @desc update Permission data
 * @route api/v1/Enquire/:id
 * @method Put
 * @access protected
 */
export const updateEnquire = asyncHandler(async (req, res) => {
  //get the Enquire id
  const { id } = req.params;
  // get the form data
  const { name, email, mobile, comment, status } = req.body;
  // validation
  if (!name) {
    throw new Error("Enquire Name Is required");
  }
  //find the Enquire
  const enquire = await Enquire.findById(id).exec();
  if (!enquire) {
    throw new Error("Enquire not found");
  }
  //update the Enquire
  const updateEnquireData = await Enquire.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      email,
      mobile,
      comment,
      status,
    },
    {
      new: true,
    }
  );
  //response the Enquire data
  res.json({
    message: `Enquire updated successful`,
    enquire: updateEnquireData,
  });
});

/**
 * @desc update Enquire Status
 * @route PUT /enquire/status/:id
 * @access PUBLIC
 */

export const updateEnquireStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const updateEnquireStatus = await Enquire.findByIdAndUpdate(
    id,
    {
      status: status,
    },
    {
      new: true,
    }
  );

  res.json({
    message: `Status updated successful`,
    enquire: updateEnquireStatus,
  });
});
