import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secret.js";

//Generate Token
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

//verify the token
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
