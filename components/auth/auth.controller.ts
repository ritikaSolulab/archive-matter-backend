import { Request, Response } from "express";
import axios from "axios";
import User from "../auth/auth.model";
import UserService from "../databaseFactoryServices";
import tokenValidator from "../../middleware/token.validator";
import messages from "../../config/messages";
import constants from "../../config/constants";
import response from "../../helpers/request.helper";
import mailHelper from "../../helpers/mail.helper";
import { info, error, debug } from '../../config/logger';

class authController {
  userService: UserService;
  constructor() {
    this.userService = new UserService()
  }

  register = async (req: Request, res: Response) => {
    info('Inside register')
    try {
      const { email, password, name } = req.body;
      const userData = await this.userService.getDetails(email, "email", 'password email _id token', User);
      if (userData) {
        return response.helper(
          res,
          true,
          "User already registered",
          {},
          constants.RESPONSE_STATUS.BAD_REQUEST
        );
      }

      const responseData = {
        email,
        password,
        name,
        user: userData
      };
      if(!userData) {
        await this.userService.insertDataFactory(responseData, User)
        return response.helper(
          res,
          true,
          "Signup Successfully, please check email to and verify",
          responseData,
          constants.RESPONSE_STATUS.SUCCESS
        )
      }
    } catch (err) {
      //error()
      console.log(err)
      response.helper(
        res,
        false,
        "SOMETHING_WENT_WRONG",
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };
  login = async (req: Request, res: Response) => {
    info('Inside login')
    try {
      const { email, password } = req.body;
      const userData = await this.userService.getDetails(email, "email", 'password email _id token', User);
      if (!userData) {
        return response.helper(
          res,
          true,
          "User not registered",
          {},
          constants.RESPONSE_STATUS.BAD_REQUEST
        );
      }
      if (!await userData.confirmPassword(password)) {
        return response.helper(
          res,
          false,
          "Wrong Credentials",
          {},
          constants.RESPONSE_STATUS.BAD_REQUEST
        );
      }
      delete userData.password;
      const token = tokenValidator.generateToken(JSON.stringify(userData))
      await User.updateOne({email:email}, {token:token})
      const responseData = {
        token,
        user: userData
      };
      return response.helper(
        res,
        true,
        "Login Success",
        responseData,
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      //error()
      err
      response.helper(
        res,
        false,
        "SOMETHING_WENT_WRONG",
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };

  testThirdPartyApi = async (req: Request, res: Response) => {
    try {
      const resData = axios.get("https://www.google.com/");
      return response.helper(
        res,
        true,
        "Mock Request Success",
        { resData },
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(
        res,
        false,
        "SOMETHING_WENT_WRONG",
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };

  resourceFile = async (req: Request, res: Response) => {
    try {
      const { isError } = req.query;
      if (isError) {
        throw new Error("Custom Error");
      }
      return response.helper(
        res,
        true,
        "Resource Success",
        {},
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(
        res,
        false,
        "SOMETHING_WENT_WRONG",
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };

  sendVerifyCode = async (req: Request, res: Response) => {
    info('Inside send verify code')
    const randomOtp = Math.floor(Math.random() * 6);
    const { email } = req.body;
    const userData = await this.userService.updateDataFactory({ email }, { loginOtp: randomOtp }, [], 'email _id loginOtp token', User)
    if(userData){
      await mailHelper.sendMail('verifyEmail', {otp:randomOtp, sendTo:email})
      return response.helper(res, true, messages.en.SUCCESS.USER_SEND_OTP, {},  constants.RESPONSE_STATUS.SUCCESS)
    }
    
    if (!userData) {
      return response.helper(res, false, messages.en.ERROR.USER_NOT_FOUND, {}, constants.RESPONSE_STATUS.BAD_REQUEST)
    }
    response.helper(
      res,
      false,
      messages.en.SUCCESS.USER_SEND_OTP,
      {},
      constants.RESPONSE_STATUS.SERVER_ERROR
    );
  }
  
  verifyCode = async (req: Request, res: Response) => {
    info('Inside verify code')
    try{
      const { email, otp } = req.body;
      //console.log(req.body)
      const userData = await this.userService.getSingleData({ email }, [], 'email _id loginOtp tokens', User);
      //console.log(userData)
      if (!userData) {
        return response.helper(res, false, messages.en.ERROR.USER_NOT_FOUND, {}, constants.RESPONSE_STATUS.BAD_REQUEST);
      }
      if (userData.loginOtp !== Number(otp)) {
        return response.helper(res, false, messages.en.ERROR.USER_OTP_WRONG, {}, constants.RESPONSE_STATUS.BAD_REQUEST);
      }
      delete userData.loginOtp;
      //let token;
      //try {
        let token = tokenValidator.generateToken(JSON.stringify(userData))
        console.log(token)
      // }catch(err){
      //   console.log(err)
      // }
      await User.updateOne({email:email}, {$set:{isEmailVerified:true}})
      const updatedData = {
        email,
        loginOtp: null,
        tokens: {
          $addToSet: {
            createdAt: new Date(),
            token,
          }
        }
      }
      await this.userService.updateDataFactory({ email }, updatedData, [], 'email _id loginOtp tokens', User)
      return response.helper(res, true, messages.en.SUCCESS.USER_VERIFY_OTP, {}, constants.RESPONSE_STATUS.SUCCESS);
    } catch (err) {
      console.log(err)
      response.helper(
        res,
        false,
        "SOMETHING_WENT_WRONG",
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  }


  
}
export default new authController();