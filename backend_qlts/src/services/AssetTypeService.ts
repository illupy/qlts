import { AppDataSource } from "../data-source";
import { AssetType } from "../entity/AssetType";
import { BaseService } from "./BaseService";
import {
  AssetTypeDto,
  CreateAssetTypeDto,
  AssetTypeSave,
} from "../types/AssetTypeDto";
import { AssetTypePaginateRequest } from "../types/PageinateInfo";
import { Not } from "typeorm";
import ExistedException from "../exceptions/ExistedException";
import InvalidateInputException from "../exceptions/InvalidateInputException";
import { AssetGroup } from "../entity/AssetGroup";
import { param } from "express-validator";
import NotFoundException from "../exceptions/NotFoundException";
import { AssetTypeStatus, ManagementType } from "../constant/AppConstant";
import { Product } from "../entity/Product";
import CannotDeleteException from "../exceptions/CannotDeleteException";

export class AssetTypeService extends BaseService<AssetType> {
  constructor() {
    super(AppDataSource.getRepository(AssetType));
  }

  // Lay danh sach loai tan san phan trang tuong tu AssetGroupService
  public paginateAssetTypes = async (params: AssetTypePaginateRequest) => {
    const {
      page,
      pageSize,
      searchTypeCode,
      searchTypeName,
      searchGroupName,
      searchManagementType,
      searchStatus,
      searchNote,
      orderBy,
      orderDirection,
    } = params;
    const query = this.repository
      .createQueryBuilder("assetType")
      .leftJoinAndSelect("assetType.groupId", "group")
      .where("1=1");

    if (searchTypeCode)
      query.andWhere("assetType.typeCode LIKE :typeCode", {
        typeCode: `%${searchTypeCode}%`,
      });
    if (searchTypeName)
      query.andWhere("assetType.typeName LIKE :typeName", {
        typeName: `%${searchTypeName}%`,
      });
    if (searchGroupName)
      query.andWhere("group.groupName LIKE :groupName", {
        groupName: `%${searchGroupName}%`,
      });
    if (searchStatus)
      query.andWhere("assetType.status = :status", { status: searchStatus });
    if (searchManagementType)
      query.andWhere("assetType.managementType = :managementType", {
        managementType: searchManagementType,
      });
    if (searchNote)
      query.andWhere("assetType.note LIKE :note", { note: `%${searchNote}%` });

    if (orderBy === "groupName") {
      query.orderBy("group.groupName", orderDirection || "ASC");
    } else if (orderBy) {
      query.orderBy(`assetType.${orderBy}`, orderDirection || "ASC");
    } else {
      query.orderBy("assetType.id", "ASC");
    }

    query.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await query.getManyAndCount();

    const assetTypes: AssetTypeDto[] = data.map((item) => ({
      id: item.id,
      typeCode: item.typeCode,
      typeName: item.typeName,
      groupName: item.groupId.groupName,
      groupId: item.groupId.id,
      managementType: item.managementType,
      status: item.status,
      note: item.note,
    }));
    return { data: assetTypes, total, page, pageSize };
  };
  public createAssetType = async (
    params: CreateAssetTypeDto
  ): Promise<AssetTypeSave> => {
    // Validate typeCode
    if (params.typeCode) {
      if (
        params.typeCode.length > 10 ||
        !/^[a-zA-Z0-9_\/]+$/.test(params.typeCode)
      ) {
        throw new InvalidateInputException("Asset type code");
      }
      // Check tồn tại typeCode
      const existedTypeCode = await this.repository.findOne({
        where: { typeCode: params.typeCode },
      });
      if (existedTypeCode) {
        throw new ExistedException(`Asset Type Code ${params.typeCode}`);
      }
    } else {
      params.typeCode = await this.generateNextTypeCode();
    }

    // Validate typeName
    if (!params.typeName || params.typeName.length > 50) {
      throw new InvalidateInputException("Asset type name");
    }
    // Check tồn tại typeName
    const existedTypeName = await this.repository.findOne({
      where: { typeName: params.typeName },
    });
    if (existedTypeName) {
      throw new ExistedException(`Asset Type Name ${params.typeName}`);
    }

    // Validate groupId tồn tại
    const groupRepo = AppDataSource.getRepository(AssetGroup);
    const group = await groupRepo.findOne({
      where: { id: params.groupId },
    });
    if (!group) {
      throw new NotFoundException("Asset Group");
    }

    if (!params.managementType) {
      params.managementType = ManagementType.QUANTITY;
    }
    if (!params.status) {
      params.status = AssetTypeStatus.ACTIVE;
    }
    const { groupId, ...createAssetType } = params;

    const assetType = this.repository.create({
      ...createAssetType,
      groupId: group,
    });
    return await this.repository.save(assetType);
  };
  public updateAssetType = async (
    id: number,
    params: CreateAssetTypeDto
  ): Promise<AssetTypeSave> => {
    // Validate typeCode
    if (params.typeCode) {
      if (
        params.typeCode.length > 10 ||
        !/^[a-zA-Z0-9_\/]+$/.test(params.typeCode)
      ) {
        throw new InvalidateInputException("Asset type code");
      }
      // Check tồn tại typeCode khác id
      const existedTypeCode = await this.repository.findOne({
        where: { typeCode: params.typeCode, id: Not(id) },
      });
      if (existedTypeCode) {
        throw new ExistedException(`Asset Type Code ${params.typeCode}`);
      }
    } else {
      params.typeCode = await this.generateNextTypeCode();
    }

    // Validate typeName
    if (!params.typeName || params.typeName.length > 50) {
      throw new InvalidateInputException("Asset type name");
    }
    // Check tồn tại typeName khác id
    const existedTypeName = await this.repository.findOne({
      where: { typeName: params.typeName, id: Not(id) },
    });
    if (existedTypeName) {
      throw new ExistedException(`Asset Type Name ${params.typeName}`);
    }

    // Validate groupId tồn tại
    const groupRepo = AppDataSource.getRepository(AssetGroup);
    const group = await groupRepo.findOne({
      where: { id: params.groupId },
    });
    if (!group) {
      throw new NotFoundException("Asset Group");
    }

    if (!params.managementType) {
      params.managementType = ManagementType.QUANTITY;
    }
    if (!params.status) {
      params.status = AssetTypeStatus.ACTIVE;
    }

    const assetType = await this.repository.findOneBy({ id });
    if (!assetType) {
      throw new NotFoundException("Asset Type");
    }
    // newData chua params, bao gom groupId, nhung khong bao gom id-number
    const newData = {
      id,
      ...params,
      groupId: group,
    };
    // Merge new data into existing assetType
    this.repository.merge(assetType, newData);

    return await this.repository.save(assetType);
  };
  //Delete asset type by id
  public async deleteAssetType(id: number): Promise<void> {
    const assetType = await this.repository.findOneBy({ id });
    if (!assetType) {
      throw new NotFoundException("Asset Type");
    }
    // cannot delete the type that in used in table product
    const productRepo = AppDataSource.getRepository(Product);
    const productWithTypeId = await productRepo.findOne({
      where: { assetTypeId: id },
    });
    if (productWithTypeId) throw new CannotDeleteException("This asset type");
    await this.repository.remove(assetType);
  }
  // Hàm sinh mã tự động
  public async generateNextTypeCode(): Promise<string> {
    const last = await this.repository
      .createQueryBuilder("assetType")
      .where("assetType.typeCode LIKE :prefix", { prefix: "LTS%" })
      .orderBy("assetType.typeCode", "DESC")
      .getOne();
    let nextNum = 1;
    if (last && last.typeCode.length === 6) {
      const num = parseInt(last.typeCode.slice(3), 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    return `LTS${nextNum.toString().padStart(3, "0")}`;
  }

  public getActiveAssetTypes = async () => {
      return this.repository.find({
        where: { status: AssetTypeStatus.ACTIVE },
        order: { typeName: "ASC" },
        select: ["id", "typeName"],
      });
    };
}
