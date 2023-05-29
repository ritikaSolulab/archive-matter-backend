import express from "express";
import userController from "./user.controller";
import { addUserValidator } from "../../validation/auth.validation";
import request from "../../middleware/request.validator";
const userRouter = express.Router();

userRouter.post("/", request(addUserValidator), userController.addUser);
userRouter.get("/details/:id", userController.userDetails);
userRouter.put("/update/:id", userController.userUpdate);
userRouter.delete("/remove/:id", userController.removeUser);
userRouter.post("/setDetails", userController.setDetails);
// userRouter.get('/profile', userController.);

export default userRouter;
