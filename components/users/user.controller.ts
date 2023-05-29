import { Request, Response } from "express";
import User from "../users/user.model";
import UserService from "../databaseFactoryServices";
import response from "../../helpers/request.helper";
import constants from "../../config/constants";
import messages from "../../config/messages";
import { info, error, debug } from "../../config/logger";
class userController {
  userService: UserService;
  constructor() {
    this.userService = new UserService()
  }
  addUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const userData = {
        name,
        email,
        password,
      };
      await this.userService.insertDataFactory(userData, User);
      return response.helper(
        res,
        true,
        messages.en.SUCCESS.USER_ADDED,
        {},
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(res, false, "", {}, constants.RESPONSE_STATUS.SERVER_ERROR);
    }
  };
  userDetails = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.userService.getDetails(id, '_id', 'password email _id role socialLogin language address', User);
      return response.helper(
        res,
        true,
        messages.en.SUCCESS.USER_DETAILS,
        data || {},
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(res, false, "", {}, constants.RESPONSE_STATUS.SERVER_ERROR);
    }
  };
  userUpdate = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const data = await this.userService.updateDataFactory({ _id: id }, req.body, [], '', User);
      return response.helper(
        res,
        true,
        messages.en.SUCCESS.USER_UPDATED,
        data || {},
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(res, false, "", {}, constants.RESPONSE_STATUS.SERVER_ERROR);
    }
  };
  removeUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.userService.deleteDataFactory({ _id: id }, User);
      return response.helper(
        res,
        true,
        messages.en.SUCCESS.USER_DELETED,
        data || {},
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(res, false, "", {}, constants.RESPONSE_STATUS.SERVER_ERROR);
    }
  };

  setDetails = async (req: Request, res: Response) => {
    const { email, location, language, address, firstName, lastName, userName, state, city, address2 } = req.body;
    const { _id } = req.user;
    const updatedData = Object.assign({},
      email === null ? null : { email },
      location === null ? null : { location },
      language === null ? null : { language },
      address === null ? null : { address },
      firstName === null ? null : { firstName },
      lastName === null ? null : { lastName },
      userName === null ? null : { userName },
      state === null ? null : { state },
      city === null ? null : { city },
      address2 === null ? null : { address2 }
    );
    const data = await this.userService.updateDataFactory({ _id }, updatedData, [], '', User);
    return response.helper(res, false, messages.en.SUCCESS.USER_UPDATED, data, constants.RESPONSE_STATUS.SUCCESS);
  }
}
export default new userController();