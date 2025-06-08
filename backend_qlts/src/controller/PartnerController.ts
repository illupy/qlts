import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { HttpStatus, Status } from "../constant/HttpStatus";
import {
  PartnerPaginateRequest,
  PaginateInfo,
} from "../types/PageinateInfo";
import { PartnerService } from "../services/PartnerService";
import { PartnerDto, CreatePartnerDto } from "../types/PartnerDto";

class PartnerController {
  public partnerService = new PartnerService();
  //POST "/partner-paginate/"
  public getPartners = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const partnerParams: PartnerPaginateRequest = req.body;
      const data: PaginateInfo<PartnerDto> =
        await this.partnerService.paginatePartners(partnerParams);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        partner: data,
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
  //POST "/partner"
  public createPartner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const partnerData: CreatePartnerDto = req.body;
      const partner = await this.partnerService.createPartner(
        partnerData
      );
      return res.status(HttpStatus.CREATED).json({
        status: Status.SUCCESS,
        data: partner,
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
  //GET "/partner/:id"
  public getPartnerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      const partner: PartnerDto =
        await this.partnerService.getPartnerById(id);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: partner,
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
        });
      }
    }
  };
  //PUT "/partner/:id"
  public updatePartner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      const newData: CreatePartnerDto = req.body;
      const updatedPartner: PartnerDto =
        await this.partnerService.updatePartner(id, newData);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: updatedPartner,
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
  //DELETE "/partner/:id"
  public deletePartner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      await this.partnerService.deletePartner(id);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
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
          message: error.message,
        });
      }
    }
  };
  // GET "/partner/active-partners"
  public getActivePartners = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const partners = await this.partnerService.getActivePartners();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: partners,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
export default new PartnerController();
