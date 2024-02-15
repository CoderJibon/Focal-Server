import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import createSlug from "../utils/createSlug.js";
import { cloudUpload, cloudDelete } from "../utils/cloudinary.js";

/**
 * @desc get all Blog data
 * @route api/v1/blog/all
 * @Method Get
 * @access PUBLIC
 */

export const getAllBlog = asyncHandler(async (req, res) => {
  //Find all blogs data
  const blogs = await Blog.find()
    .populate("likes")
    .populate("dislikes")
    .populate("tag")
    .populate("category")
    .populate("author");
  // return all blogs data
  if (blogs.length > 0) {
    return res.status(200).json(blogs);
  }
  // if not found blogs data
  res.status(200).json([]);
});

/**
 * @desc Create a new blog
 * @route api/v1/blog
 * @Method Post
 * @access protected
 */
export const createBlog = asyncHandler(async (req, res) => {
  // get body data
  const { title, description, shortDesc, category, tag, author } = req.body;

  let blogPhoto = null;
  if (req.file) {
    const blogP = await cloudUpload(req.file.path);
    blogPhoto = {
      url: blogP.url,
      public_id: blogP.public_id,
    };
  }

  // validations
  if (!title) {
    throw new Error("Title is required");
  }
  // email check
  const titleCheck = await Blog.findOne({ title });

  if (titleCheck) {
    throw new Error("Blog already exists");
  }

  // create new Blog
  const blog = await Blog.create({
    title,
    slug: createSlug(title),
    description,
    shortDesc,
    category: category ? category : null,
    tag: tag ? tag : [],
    author,
    images: blogPhoto ? blogPhoto : null,
  });

  res.status(201).json({ blog, message: "Blog created successfully" });
});

/**
 * @desc get single blog
 * @route api/v1/blog/:slug
 * @Method get
 * @access public
 */
export const getSingleBlog = asyncHandler(async (req, res) => {
  try {
    // get params slug
    const { slug } = req.params;
    //find bold data
    const blog = await Blog.findOne({ slug })
      .populate("likes")
      .populate("dislikes")
      .populate("tag")
      .populate("category")
      .populate("author");
    // if not found blog data
    if (!blog) {
      throw new Error("Blog not found");
    }
    //blog views update
    await Blog.findByIdAndUpdate(
      blog._id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    // return blog data
    res.status(200).json({ blog });
  } catch (error) {
    throw new Error(" Something went wrong try to again");
  }
});

/**
 * @desc Delete single blog
 * @route api/v1/blog/:id
 * @Method delete
 * @access protected
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  //get params id
  const { id } = req.params;
  //find and delete blog
  const blog = await Blog.findByIdAndDelete(id);
  //not available blog
  if (!blog) {
    throw new Error("Blog Already Delete");
  }
  // delete cloud image
  if (blog.images?.public_id) {
    await cloudDelete(blog.images?.public_id);
  }
  //response
  res.status(200).json({ message: "Delete Successful", blog });
});

/**
 * @desc Update single blog
 * @route api/v1/blog/:id
 * @Method put
 * @access protected
 */
export const updateBlog = asyncHandler(async (req, res) => {
  //get params id
  const { id } = req.params;
  // get body data
  const { title, description, shortDesc, category, tag } = req.body;

  // validation
  if (!title) {
    throw new Error("Blog title Is required");
  }

  //photo update
  let blogPhoto = null;
  if (req.file) {
    const blogP = await cloudUpload(req.file.path);
    blogPhoto = {
      url: blogP.url,
      public_id: blogP.public_id,
    };
  }

  //is available blog data
  const blog = await Blog.findById(id).exec();
  // is not available a blog data
  if (!blog) {
    throw new Error("Blog not found");
  }

  //update images
  if (!blogPhoto) {
    blogPhoto = blog.photo;
  } else {
    if (blog.photo?.public_id) {
      await cloudDelete(blog.photo?.public_id);
    }
  }

  //update blog data
  const updateBlogData = await Blog.findByIdAndUpdate(
    id,
    {
      title,
      slug: createSlug(title),
      description,
      shortDesc,
      category: category ? category : null,
      tag: tag ? tag : [],
      images: blogPhoto ? blogPhoto : null,
    },
    {
      new: true,
    }
  );
  //response blog update
  res.status(200).json({
    message: `updated successful`,
    blog: updateBlogData,
  });
});

/**
 * @desc Blog Is Like
 * @route api/v1/blog/like
 * @Method post
 * @access protected
 */
export const likeBlog = asyncHandler(async (req, res) => {
  //get body data
  const { blogId } = req.body;
  if (!blogId) {
    throw new Error("Invalid Blog ID");
  }
  //find blog
  const blog = await Blog.findById(blogId);
  //login user
  const user = req.me;
  //already dislike blog
  const dislike = blog.dislikes.find(
    (el) => el._id.toString() === user._id.toString()
  );

  //if dislike is available
  if (dislike) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: user._id },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  }
  // if like true
  if (blog.isLiked === true) {
    const unLike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: user._id },
        isLiked: false,
      },
      {
        new: true,
      }
    ).populate("likes");
    //response
    res.status(200).json({ message: "Blog unLike successful ", blog: unLike });
  } else {
    const likeb = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: user._id },
        isLiked: true,
      },
      {
        new: true,
      }
    ).populate("likes");
    //response
    res.status(200).json({ message: "Blog like successful ", blog: likeb });
  }
});

/**
 * @desc Blog Is dislike
 * @route api/v1/blog/dislike
 * @Method post
 * @access protected
 */

export const dislikeBlog = asyncHandler(async (req, res) => {
  //get body data
  const { blogId } = req.body;
  if (!blogId) {
    throw new Error("Invalid Blog ID");
  }
  //find blog
  const blog = await Blog.findById(blogId);
  //login user
  const user = req.me;

  //already like blog
  const like = blog.likes.find(
    (el) => el._id.toString() === user._id.toString()
  );
  //if like is available
  if (like) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: user._id },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }
  // if dislike true
  if (blog.isDisliked === true) {
    const unDisLike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: user._id },
        isDisliked: false,
      },
      {
        new: true,
      }
    ).populate("dislikes");
    //response
    res
      .status(200)
      .json({ message: "Blog unDislike successful ", blog: unDisLike });
  } else {
    const dislike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: user._id },
        isDisliked: true,
      },
      {
        new: true,
      }
    ).populate("dislikes");
    //response
    res
      .status(200)
      .json({ message: "Blog dislike successful ", blog: dislike });
  }
});

/**
 * @DESC update a Blog photo delete
 * @ROUTE /api/v1/blog/image/:id
 * @METHOD put
 * @ACCESS protected
 */
export const updateBlogImageDelete = asyncHandler(async (req, res) => {
  try {
    // get params id
    const { id } = req.params;
    // get body data
    const { imageId } = req.body;
    const bg = await Blog.findById(id);

    // Find by id
    const brand = await Blog.findByIdAndUpdate(
      id,
      {
        images: bg.photo?.public_id == imageId ? null : bg.photo,
      },
      { new: true }
    );

    //if does not available
    if (!bg) {
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
