import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createEnquire,
  deleteEnquire,
  getAllEnquire,
  getSingleEnquire,
  updateEnquire,
  updateEnquireStatus,
} from "../controller/enquiryController.js";

//express init
const enquireRoute = express.Router();

// routing
enquireRoute.route("/all").get(getAllEnquire);
enquireRoute.route("/").post(createEnquire);
enquireRoute.route("/:id").get(getSingleEnquire);
enquireRoute.route("/:id").delete(authMiddleware, isAdmin, deleteEnquire);
enquireRoute.route("/:id").put(authMiddleware, isAdmin, updateEnquire);
enquireRoute
  .route("/status/:id")
  .put(authMiddleware, isAdmin, updateEnquireStatus);

//export Enquire routes
export default enquireRoute;
