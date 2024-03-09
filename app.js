import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import errorHandler from "./middlewares/errorHandlers.js";
import notFound from "./middlewares/notFound.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import blogRoute from "./routes/blogRoute.js";
import blogCategoryRoute from "./routes/blogCategoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import productCatRoute from "./routes/productCategoryRoute.js";
import couponRoute from "./routes/couponRoute.js";
import colorRoute from "./routes/colorRoute.js";
import tagRouter from "./routes/tagRoute.js";
import enquireRoute from "./routes/enquiryRoute.js";

//express initialization
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

//static Folder
app.use(express.static(path.join(path.resolve() + "/public")));

//router routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/blog-category", blogCategoryRoute);
app.use("/api/v1/product-category", productCatRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/color", colorRoute);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/enquire", enquireRoute);
app.use("/api/v1/auth", authRoute);

//error handlers
app.use(errorHandler);

//404 not found
app.use(notFound);

//export app
export default app;
