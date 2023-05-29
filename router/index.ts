import { Express, Request, Response } from "express";
import authRouter from "../components/auth/auth.router";
import userRouter from "../components/users/user.router";
import request from "../helpers/request.helper";
import tokenValidator from "../middleware/token.validator";

export default (app: Express) => {
  app.use("/", authRouter);
  app.use("/user", tokenValidator.tokenValidate(), userRouter);
  app.use(request.notFound);
};
