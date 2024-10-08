import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) 
  {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select("-password")
      next()
    }
    catch (error) {
      console.log("Req User could not authenticated", error)
      return res.status(401).json(error.message)
    }
  }

 if(!token){
  console.log("No token hence no authorization")
  return res.status(401).json({message : "No token hence no authorization"})
 }

});

export default protect;
