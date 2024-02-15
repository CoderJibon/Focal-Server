import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import createSlug from "../utils/createSlug.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import uniqid from "uniqid";
import { cloudDelete, cloudUpload } from "../utils/cloudinary.js";
/**
 * @DESC Get all users
 * @ROUTE /api/v1/user/all
 * @METHOD GET
 * @ACCESS public
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users
  const users = await User.find().select("-password");
  //if get all users
  if (users.length > 0) {
    return res.status(200).json({ users });
  }
  //response
  res.status(404).json([]);
});

/**
 * @DESC Get Single User
 * @ROUTE api/v1/user/:id
 * @METHOD Get
 * @ACCESS public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //response
  res.status(200).json({ user });
});

/**
 * @DESC Delete Single User
 * @ROUTE api/v1/user/:id
 * @METHOD Delete
 * @ACCESS public
 */
export const deleteSingleUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //delate user
  const userId = await User.findByIdAndDelete(id);

  // delete cloud image
  if (user?.photo?.public_id) {
    await cloudDelete(user?.photo?.public_id);
  }

  //response
  res.status(200).json({ user: userId, message: "User delete successfully" });
});

/**
 * @DESC Update Single User
 * @ROUTE api/v1/user/:id
 * @METHOD PUT
 * @ACCESS public
 */
export const updateSingleUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //get body data
  const { firstName, lastName, address, mobile, gender } = req.body;
  //photo update
  let userPhoto = null;
  if (req.file) {
    const userP = await cloudUpload(req.file.path);
    userPhoto = {
      url: userP.url,
      public_id: userP.public_id,
    };
  }
  // is empty
  if (!firstName) {
    throw new Error("First-Name Name is Required");
  }
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }

  //update images
  if (!userPhoto) {
    userPhoto = user?.photo;
  } else {
    if (user?.photo?.public_id) {
      await cloudDelete(user.photo?.public_id);
    }
  }

  //update user
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      mobile,
      gender,
      address,
      slug: await createSlug(firstName + "-" + lastName),
      photo: userPhoto ? userPhoto : null,
    },
    {
      new: true,
    }
  );
  //response
  res
    .status(200)
    .json({ user: updateUser, message: "User Update successfully" });
});

/**
 * @DESC block User
 * @ROUTE api/v1/user/:id
 * @METHOD Get
 * @ACCESS public
 */
export const blockUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //update block user
  const blockUser = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  //response
  res.status(200).json({ message: "user is Block!" });
});

/**
 * @DESC unblock User
 * @ROUTE api/v1/user/:id
 * @METHOD Get
 * @ACCESS public
 */
export const unblockUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //update unblock user
  const unblockUser = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  //response
  res.status(200).json({ message: "user is unblock!" });
});

/**
 * @DESC Get all wishlist
 * @ROUTE /api/v1/user/wishlist
 * @METHOD GET
 * @ACCESS protected
 */
export const getWishlist = asyncHandler(async (req, res) => {
  try {
    //login user
    const { _id } = req.me;
    // Get all users
    const user = await User.findById(_id).populate("wishlist");
    //response
    res.status(200).json(user);
  } catch (error) {
    throw new Error("not authorized");
  }
});

/**
 * @DESC save user address
 * @ROUTE api/v1/user/address
 * @METHOD put
 * @ACCESS protected
 */

export const saveAddress = asyncHandler(async (req, res) => {
  //login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  try {
    //find by user and update
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @DESC User AddToCart
 * @ROUTE api/v1/user/cart
 * @METHOD POST
 * @ACCESS protected
 */
export const addToCart = asyncHandler(async (req, res) => {
  //login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  //get body cart data
  const { cart } = req.body;
  if (!cart.length > 0) {
    res.status(404).json([]);
  }
  try {
    //Check if order products is still in the cart
    const alreadyProducts = await Cart.findOne({ orderby: _id });
    if (alreadyProducts) {
      await Cart.findByIdAndDelete(alreadyProducts._id);
    }

    //get add to cart list
    let products = [];

    for (const carts of cart) {
      let obj = {};
      obj.product = carts.id;
      obj.quantity = carts.quantity;
      obj.color = carts.color;
      obj.size = carts.size;
      let getPrice = await Product.findById(carts.id).select("price").exec();
      obj.price = getPrice ? getPrice.price : null;
      products.push(obj);
    }

    // get the cart Total
    let cartTotal = 0;
    if (products.length > 0) {
      for (const product of products) {
        cartTotal += product.price * product.quantity;
      }
    }

    // update cart
    const newCart = await Cart.create({
      products: products,
      cartTotal: cartTotal,
      totalAfterDiscount: 0,
      orderby: _id,
    });

    //response
    res.status(200).json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});
/**
 * @DESC get user cart product
 * @ROUTE api/v1/user/cart
 * @METHOD GET
 * @ACCESS protected
 */

export const getUserCart = asyncHandler(async (req, res) => {
  //login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    //response
    res.status(200).json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @DESC Cart empty
 * @ROUTE api/v1/user/cart
 * @METHOD DELETE
 * @ACCESS protected
 */
export const emptyCart = asyncHandler(async (req, res) => {
  //login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  try {
    // cart is empty
    const cart = await Cart.findOneAndRemove({ orderby: _id });
    //response
    res.status(200).json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
/**
 * @DESC Apply coupon
 * @ROUTE api/v1/user/cart
 * @METHOD DELETE
 * @ACCESS protected
 */
export const applyCoupon = asyncHandler(async (req, res) => {
  //get coupon data from body
  const { coupon } = req.body;
  if (!coupon) {
    throw new Error("there are no Coupon"); //
  }
  //get login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  //validate coupon
  const vCoupon = await Coupon.findOne({ name: coupon });
  if (!vCoupon) {
    throw new Error("Invalid coupon");
  }
  //cart product
  const pdCart = await Cart.findOne({ orderby: _id });

  //cart discount
  const discount = (
    pdCart?.cartTotal -
    (pdCart?.cartTotal * vCoupon?.discount) / 100
  ).toFixed(2);
  // update discount
  await Cart.findOneAndUpdate(
    { orderby: _id },
    { totalAfterDiscount: discount },
    { new: true }
  );
  //response for cart discount
  res.status(200).json(discount);
});

/**
 * @DESC Create a CashOrder
 * @ROUTE api/v1/user/cart/cash-order
 * @METHOD post
 * @ACCESS protected
 */
export const createCashOrder = asyncHandler(async (req, res) => {
  //login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  //get from body data
  const { COD, couponApplied } = req.body;
  try {
    //if not found Create cash order
    if (!COD) {
      throw new Error("Create cash order failed");
    }
    // get user cart
    let userCart = await Cart.findOne({ orderby: _id });
    if (!userCart) {
      throw new Error("There are no products in cart");
    }
    // total amount
    let totalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      totalAmount = userCart.totalAfterDiscount;
    } else {
      totalAmount = userCart.cartTotal;
    }

    //create cash on delivery Order
    let cashOrder = await Order.create({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: totalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderStatus: "Cash on Delivery",
      orderby: _id,
    });
    // update quantity
    // if (userCart.products.length > 0) {
    //   for (const item of userCart.products) {
    //     await Product.findByIdAndUpdate(item.product.toString(), {
    //       $inc: { quantity: -item.quantity, sold: +item.quantity },
    //     });
    //   }
    // }
    // update quantity
    const updateProduct = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    await Product.bulkWrite(updateProduct);

    //response
    res.status(200).json({ message: "Success" });
  } catch (error) {
    throw new Error(error);
  }
});
/**
 * @DESC get a Order
 * @ROUTE api/v1/user/gat-order
 * @METHOD get
 * @ACCESS protected
 */
export const getSingleOrder = asyncHandler(async (req, res) => {
  //login user
  const { _id } = req.me;
  if (!req.me) {
    throw new Error("not authorized");
  }
  try {
    //get user Order
    const userOrders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    //response the order
    res.status(200).json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});
/**
 * @DESC get all Order
 * @ROUTE api/v1/user/get-all-order
 * @METHOD get
 * @ACCESS protected
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    //get all Order
    const allUserOrders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    //response the order
    res.status(200).json(allUserOrders);
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @desc delete a single Order
 * @route api/v1/user/get-all-order/order/:id
 * @method delete
 * @access protected
 */

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    return res.status(400).json({ message: "Tag delete failed" });
  }

  res.json({ message: "Delete Successful", order });
});

/**
 * @DESC get order by user id
 * @ROUTE api/v1/user/get-order-by-user
 * @METHOD get
 * @ACCESS protected
 */
export const getOrderByUserId = asyncHandler(async (req, res) => {
  //get order by user id
  const { id } = req.params;
  if (!id) {
    throw new Error("User Order Not Found");
  }
  try {
    const userOrder = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    if (!userOrder) {
      throw new Error("User Order Not Found");
    }
    //response
    res.status(200).json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});
/**
 * @DESC Update Order status
 * @ROUTE api/v1/user/
 * @METHOD put
 * @ACCESS protected
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  //get order status
  const { status } = req.body;
  //get order status id
  const { id } = req.params;
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    //response
    res.status(200).json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});
