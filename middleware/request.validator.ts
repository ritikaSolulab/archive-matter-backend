import { Request, Response, NextFunction } from 'express';
import response from '../helpers/request.helper';
import constants from '../config/constants';

export default (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const params = req.body;
    const valid = schema.validate(params);
    const data = valid.value;
    if (valid.error) {
      return response.helper(res, false, valid.error, {}, constants.RESPONSE_STATUS.BAD_REQUEST);
    }
    next();
  };
};
