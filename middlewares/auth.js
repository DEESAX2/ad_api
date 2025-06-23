import jwt from "jsonwebtoken";
import { roles } from "../utils/roles.js";
import { secret } from "../config/env.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

export const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const role = req.user.role;
      const userRole = roles.find((element) =>element.role === role);
      console.log('user', role, )
        console.log('permission', permission)
       console.log('userdse',  userRole.role)
      if (userRole.role && userRole.permissions.includes(permission)) {
        console.log('permission', permission)
         console.log('permissionss', userRole.permissions.includes(permission))
        
        next();
      } else {
       return res.status(403).json("not Authorized");
      }
    } catch (error) {
        console.log('error', error)
      next();
    }
  };
};
export const secureRoute = (action, controller) => {
  return [authenticate, authorize(action), controller];
};