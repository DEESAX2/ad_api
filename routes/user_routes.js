import { Router } from "express";
import { loginUser, signUp } from "../controllers/user_controller.js";

export const UserRouter = Router();



UserRouter.post('/signup',signUp);


UserRouter.post('/login',loginUser);
