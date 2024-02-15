import mongoose from "mongoose";
import { MONGODB_URL } from "../utils/secret.js";

//DB connection
const mongodbConnection = async () => {
  try {
    // mongodb connection established
    await mongoose.connect(MONGODB_URL);
    console.log("mongodb connection established..".bgGreen.black);
  } catch (error) {
    // mongodb connection error
    console.log(`${error.message}`.bgRed.black);
  }
};

// export mongodb connection
export default mongodbConnection;
