import { SuccessMessage } from "../constant/AppMessage";
import { HttpStatus, Status } from "../constant/HttpStatus";
import HttpException from "../exceptions/HttpException";
import { UnitService } from "../services/UnitService";
import { Request, Response } from "express";
class UnitController {
  public unitService = new UnitService();
  //GET /unit/all
  public getAllUnits = async (req: Request, res: Response) => {
    try {
      const units = await this.unitService.getAllUnits();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: units,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };
  public createUnit = async (req: Request, res: Response) => {
    try {
      const name = req.body.name;
      const units = await this.unitService.createUnit(name);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: units,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };
}
export default new UnitController();
