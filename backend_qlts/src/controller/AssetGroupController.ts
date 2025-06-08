import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { HttpStatus, Status } from "../constant/HttpStatus";
import {
  AssetGroupPaginateRequest,
  PaginateInfo,
} from "../types/PageinateInfo";
import { AssetGroupService } from "../services/AssetGroupService";
import { AssetGroupDto, CreateAssetGroupDto } from "../types/AssetGroupDto";
import multer from "multer";
const upload = multer();

class AssetGroupController {
  public assetGroupService = new AssetGroupService();
  //POST "/asset-group-paginate/"
  public getAssetGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetGroupParams: AssetGroupPaginateRequest = req.body;
      const data: PaginateInfo<AssetGroupDto> =
        await this.assetGroupService.paginateAssetGroups(assetGroupParams);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        assetGroup: data,
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
  //POST "/asset-group/"
  public createAssetGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assetGroupData: CreateAssetGroupDto = req.body;
      const assetGroup = await this.assetGroupService.createAssetGroup(
        assetGroupData
      );
      return res.status(HttpStatus.CREATED).json({
        status: Status.SUCCESS,
        data: assetGroup,
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
  //GET "/asset-group/:id"
  public getAssetGroupById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      const assetGroup: AssetGroupDto =
        await this.assetGroupService.getAssetGroupById(id);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: assetGroup,
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
  //PUT "/asset-group/:id"
  public updateAssetGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      const newData: CreateAssetGroupDto = req.body;
      const updatedAssetGroup: AssetGroupDto =
        await this.assetGroupService.updateAssetGroup(id, newData);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: updatedAssetGroup,
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
  //DELETE "/asset-group/:id"
  public deleteAssetGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: number = parseInt(req.params.id);
      await this.assetGroupService.deleteAssetGroup(id);
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
  //GET "/asset-group/suggest-code"
  public genNextAssetCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const nextGroupCode =
        await this.assetGroupService.generateNextAssetCode();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: nextGroupCode,
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
  // GET "/asset-type/active-groups"
  public getActiveAssetGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groups = await this.assetGroupService.getActiveAssetGroups();
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: groups,
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
  public exportAssetGroupsTemplate = async (req: Request, res: Response) => {
    try {

      await this.assetGroupService.exportAssetGroupTemplate(res);
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
  public exportAssetGroups = async (req: Request, res: Response) => {
    try {
      await this.assetGroupService.exportAssetGroups(res);
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
  public importAssetGroups  = async (req: Request, res: Response) => {
    try {
    const file = req.file;
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({ status: "error", message: "No file uploaded" });
    }
    const result = await this.assetGroupService.importAssetGroups(file.buffer);
    return res.status(HttpStatus.OK).json({
      status: Status.SUCCESS,
      imported: result.success,
      errors: result.errors,
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
}
export default new AssetGroupController();
