import { Request, Response, NextFunction } from "express";
import { AssetTypeService } from "../services/AssetTypeService";
import HttpException from "../exceptions/HttpException";
import { HttpStatus, Status } from "../constant/HttpStatus";
import { AssetTypePaginateRequest, PaginateInfo } from "../types/PageinateInfo";
import { AssetTypeDto, CreateAssetTypeDto } from "../types/AssetTypeDto";

class AssetTypeController {
  public assetTypeService = new AssetTypeService();
  // POST "/asset-type/paginate"
  public getAssetTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetTypeParams: AssetTypePaginateRequest = req.body;
      const data: PaginateInfo<AssetTypeDto> =
        await this.assetTypeService.paginateAssetTypes(assetTypeParams);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        assetTypes: data,
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
  // POST "/asset-type"
  public createAssetType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetTypeData: CreateAssetTypeDto = req.body;
      const newAssetType = await this.assetTypeService.createAssetType(
        assetTypeData
      );
      return res.status(HttpStatus.CREATED).json({
        status: Status.SUCCESS,
        data: newAssetType,
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
  // PUT "/asset-type/:id"
  public updateAssetType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetTypeId = Number(req.params.id);
      const assetTypeData: CreateAssetTypeDto = req.body;
      const updatedAssetType = await this.assetTypeService.updateAssetType(
        assetTypeId,
        assetTypeData
      );
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: updatedAssetType,
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
  //DELETE "asset-type/:id"
  public deleteAssetType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.assetTypeService.deleteAssetType(id);
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
          message: error.message || "Internal Server Error",
        });
      }
    }

  }
  //GET "asset-type/suggest-code"
  public genNextHintCode = async (req: Request, res: Response) => {
    try {
      const nextTypeCode =
        await this.assetTypeService.generateNextTypeCode();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: nextTypeCode,
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
  }
    // GET "/asset-type/active-types"
  public getActiveAssetTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const types = await this.assetTypeService.getActiveAssetTypes();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: types,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: error.message || "Internal Server Error",
      });
    }
  };
}

export default new AssetTypeController();