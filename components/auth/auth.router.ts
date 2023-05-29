import express from "express";
import authController from "./auth.controller";
import tokenValidator from "../../middleware/token.validator";
// import userRouter from "../users/user.router";

const authRouter = express.Router();
//const userRouter = express.Router()

authRouter.get("/resource", authController.resourceFile);
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register)
authRouter.get("/mock-test", authController.testThirdPartyApi);
authRouter.post('/sendVerifyCode', authController.sendVerifyCode);
authRouter.post('/verifyCode', authController.verifyCode);
export default authRouter;
