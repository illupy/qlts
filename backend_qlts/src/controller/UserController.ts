import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { HttpStatus, Status } from "../constant/HttpStatus";

class UserController {
  private userRepository = AppDataSource.getRepository(User);

  public all = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userRepository.find();
      return res.json(users);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
        });
      }
    }
  };
}
export default new UserController();
