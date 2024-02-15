import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secret.js";

//Generate Refresh Token
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "3d" });
};

//Refresh verify the token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
