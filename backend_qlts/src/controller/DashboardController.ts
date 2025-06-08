import { SuccessMessage } from "../constant/AppMessage";
import { HttpStatus, Status } from "../constant/HttpStatus";
import HttpException from "../exceptions/HttpException";
import { DashboardService } from "../services/DashboardService";
import { Request, Response } from "express";
class DashboardController {
  public dashboardService = new DashboardService();
  //GET /dashboard/bar
  public getBarAndPieFigs = async (req: Request, res: Response) => {
    try {
      const data = await this.dashboardService.getProductCountByGroupTypeFlow();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data,
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
  public getProductCountByMonth = async (req: Request, res: Response) => {
    try {
      const year = Number(req.query.year);
      const data = await this.dashboardService.getProductCountByMonth(year);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data,
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
  public getProductCountOfPartner = async (req: Request, res: Response) => {
    try {
      const data = await this.dashboardService.getProductCountByPartner();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data,
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
export default new DashboardController();
