import { Router } from "express";
import { loginUser, signUp, updateUser } from "../controllers/user_controller.js";
import { parser } from '../utils/cloudinary.js';
import { authenticate } from "../middlewares/auth.js";


export const UserRouter = Router();



UserRouter.post('/signup',parser.single("image"), signUp);
UserRouter.patch('/update', authenticate, parser.single("image"), updateUser);


UserRouter.post('/login',loginUser);
