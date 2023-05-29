import { NextFunction, Request, Response } from 'express';
class request {
    static helper(res: Response, isSuccess: Boolean, message: String, data: Object, status: number) {
        return res.status(status).send({
            isSuccess,
            message,
            data,
        })
    }
    static notFound(req: Request, res: Response, next: NextFunction) {
        return res.status(404).send();
    }
}

export default request;