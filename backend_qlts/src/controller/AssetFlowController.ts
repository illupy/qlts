import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { HttpStatus, Status } from "../constant/HttpStatus";
import {
  AssetFlowPaginateRequest,
  PaginateInfo,
} from "../types/PageinateInfo";
import { AssetFlowService } from "../services/AssetFlowService";
import { AssetFlowDto, CreateAssetFlowDto } from "../types/AssetFlowDto";

class AssetFlowController {
  public assetFlowService = new AssetFlowService();
  //POST "/asset-Flow-paginate/"
  public getAssetFlows = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetFlowParams: AssetFlowPaginateRequest = req.body;
      const data: PaginateInfo<AssetFlowDto> =
        await this.assetFlowService.paginateAssetFlows(assetFlowParams);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        assetFlow: data,
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
  //POST "/asset-Flow/"
  public createAssetFlow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetFlowData: CreateAssetFlowDto = req.body;
      const assetFlow = await this.assetFlowService.createAssetFlow(
        assetFlowData
      );
      return res.status(HttpStatus.CREATED).json({
        status: Status.SUCCESS,
        data: assetFlow,
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
  //GET "/asset-Flow/:id"
  public getAssetFlowById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      const assetFlow: AssetFlowDto =
        await this.assetFlowService.getAssetFlowById(id);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: assetFlow,
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
  //PUT "/asset-Flow/:id"
  public updateAssetFlow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      const newData: CreateAssetFlowDto = req.body;
      const updatedAssetFlow: AssetFlowDto =
        await this.assetFlowService.updateAssetFlow(id, newData);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: updatedAssetFlow,
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
  //DELETE "/asset-Flow/:id"
  public deleteAssetFlow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      await this.assetFlowService.deleteAssetFlow(id);
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
  //GET "/asset-Flow/suggest-code"
  public genNextAssetCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const nextFlowCode =
        await this.assetFlowService.generateNextAssetCode();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: nextFlowCode,
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
  // GET "/asset-flow/active-Flows"
  public getActiveAssetFlows = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const Flows = await this.assetFlowService.getActiveAssetFlows();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: Flows,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
export default new AssetFlowController();
