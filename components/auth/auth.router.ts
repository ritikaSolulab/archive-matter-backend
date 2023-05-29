import express from "express";
import authController from "./auth.controller";

const authRouter = express.Router();

authRouter.get("/resource", authController.resourceFile);
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register)
authRouter.get("/mock-test", authController.testThirdPartyApi);
authRouter.post('/sendVerifyCode', authController.sendVerifyCode);
authRouter.post('/verifyCode', authController.verifyCode);
export default authRouter;
