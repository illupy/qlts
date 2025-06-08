// AssetFlowService.ts
import { AppDataSource } from "../data-source";
import { AssetFlow } from "../entity/AssetFlow";
import { AssetFlowDto, CreateAssetFlowDto } from "../types/AssetFlowDto";
import InvalidateInputException from "../exceptions/InvalidateInputException";
import { BaseService } from "./BaseService";
import NotFoundException from "../exceptions/NotFoundException";
import ExistedException from "../exceptions/ExistedException";
import { Like, Not } from "typeorm";
import { AssetFlowPaginateRequest } from "../types/PageinateInfo";
import CannotDeleteException from "../exceptions/CannotDeleteException";
import { AssetFlowStatus } from "../constant/AppConstant";
import { Product } from "../entity/Product";

export class AssetFlowService extends BaseService<AssetFlow> {
  constructor() {
    super(AppDataSource.getRepository(AssetFlow));
  }

  public generateNextAssetCode = async (): Promise<string> => {
    const last = await this.repository
      .createQueryBuilder("ag")
      .where("ag.flowCode LIKE :prefix", { prefix: "DTS%" })
      .orderBy("ag.flowCode", "DESC")
      .getOne();
    let nextNumber = 1;
    if (last) {
      const match = last.flowCode.match(/^DTS(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    return `DTS${String(nextNumber).padStart(3, "0")}`; // DTS001, DTS002...
  };

  /**
     * Create a new asset flow
       - flowCode: max length 6 characters and do not contain special characters. Just letters both uppercase and lowercase, numbers, underscore and slash approved.
            If user does not input flowcode, auto generate a random flowCode with rules: "DTS" + 3-digit number ascesding from 001.
       - flowName: max length 50 characters.
     */
  public createAssetFlow = async (
    assetFlowInfo: CreateAssetFlowDto
  ): Promise<AssetFlowDto> => {
    // Validate fields in assetFlowInfo and follow the rules
    if (assetFlowInfo.flowCode) {
      if (
        assetFlowInfo.flowCode.length > 6 ||
        !/^[a-zA-Z0-9_\/]+$/.test(assetFlowInfo.flowCode)
      ) {
        throw new InvalidateInputException("Flow Code");
      }
    } else {
      // Auto-generate flowCode if not provided, ascending from the last used code
      assetFlowInfo.flowCode = await this.generateNextAssetCode();
    }
    if (!assetFlowInfo.flowName || assetFlowInfo.flowName.length > 50) {
      throw new InvalidateInputException("Flow Name");
    }
    // Check if flowCode or flowName already exists

    const existingFlowCode = await this.repository.findOne({
      where: [{ flowCode: assetFlowInfo.flowCode }],
    });
    const existingFlowName = await this.repository.findOne({
      where: [{ flowName: assetFlowInfo.flowName }],
    });
    if (existingFlowCode) {
      throw new ExistedException(
        `Asset Flow with code ${assetFlowInfo.flowCode}`
      );
    }
    if (existingFlowName) {
      throw new ExistedException(
        `Asset Flow with name ${assetFlowInfo.flowName}`
      );
    }
    const assetFlow = this.repository.create(assetFlowInfo);
    return await this.repository.save(assetFlow);
  };

  // get asset flow paginated
  // public getAssetFlows = async (
  //   paginateRequest: PaginateRequest
  // ): Promise<PaginateInfo<AssetFlowDto>> => {
  //   return this.paginate(paginateRequest);
  // };

  public getAssetFlowById = async (id: number): Promise<AssetFlowDto> => {
    const assetFlow = await this.repository.findOneBy({ id });
    if (!assetFlow) {
      throw new NotFoundException(`Asset Flow`);
    }
    //map assetFlow to AssetFlowDto
    const assetFlowDto: AssetFlowDto = {
      id: assetFlow.id,
      flowCode: assetFlow.flowCode,
      flowName: assetFlow.flowName,
      status: assetFlow.status,
    };
    return assetFlowDto;
  };

  public updateAssetFlow = async (
    id: number,
    newData: CreateAssetFlowDto
  ): Promise<AssetFlowDto> => {
    const assetFlow = await this.repository.findOneBy({ id });
    if (!assetFlow) {
      throw new NotFoundException(`Asset flow with id ${id}`);
    }
    // Validate fields in newData and follow the rules
    if (newData.flowCode) {
      if (
        newData.flowCode.length > 6 ||
        !/^[a-zA-Z0-9_\/]+$/.test(newData.flowCode)
      ) {
        throw new InvalidateInputException("Flow Code");
      }
    } else {
      // Auto-generate flowCode if not provided, ascending from the last used code
      newData.flowCode = await this.generateNextAssetCode();
    }
    if (!newData.flowName || newData.flowName.length > 50) {
      throw new InvalidateInputException("Flow Name");
    }
    // Check if flowCode or flowName already exists
    // Note: We should not check the current assetFlow's code/name against itself
    const existingFlowCode = await this.repository.findOne({
      where: [{ flowCode: newData.flowCode, id: Not(id) }],
    });
    const existingFlowName = await this.repository.findOne({
      where: [{ flowName: newData.flowName, id: Not(id) }],
    });
    if (existingFlowCode) {
      throw new ExistedException(`Asset Flow with code ${newData.flowCode}`);
    }
    if (existingFlowName) {
      throw new ExistedException(`Asset Flow with name ${newData.flowName}`);
    }
    this.repository.merge(assetFlow, newData);
    return await this.repository.save(assetFlow);
  };
  public deleteAssetFlow = async (id: number): Promise<void> => {
    const assetFlow = await this.repository.findOneBy({ id });
    if (!assetFlow) {
      throw new NotFoundException(`Asset Flow with id ${id}`);
    }

    // Kiểm tra xem có Product nào dùng flow này không
    const productRepo = AppDataSource.getRepository(Product);
    const usedType = await productRepo.findOne({ where: { assetFlowId: id } });
    if (usedType) {
      throw new CannotDeleteException("Asset Flow " + assetFlow.flowCode);
    }
    // just soft delete
    await this.repository.createQueryBuilder().softDelete().where("id = :id", { id }).execute();
    // await this.repository.remove(assetFlow);
  };

  public paginateAssetFlows = async (params: AssetFlowPaginateRequest) => {
    const {
      page,
      pageSize,
      searchFlowCode,
      searchFlowName,
      searchStatus,
      searchNote,
      orderBy,
      orderDirection,
    } = params;

    const where: any = {};
    if (searchFlowCode && searchFlowCode.trim() !== "") {
      where.flowCode = Like(`%${searchFlowCode}%`);
    }
    if (searchFlowName && searchFlowName.trim() !== "") {
      where.flowName = Like(`%${searchFlowName}%`);
    }
    if (searchStatus && searchStatus.trim() !== "") {
      where.status = searchStatus;
    }
    if (searchNote && searchNote.trim() !== "") {
      where.note = Like(`%${searchNote}%`);
    }

    // Xây dựng order động
    let order: any = {};
    if (orderBy) {
      order[orderBy] = orderDirection || "ASC";
    } else {
      order = { id: "ASC" };
    }

    return this.paginate({ page, pageSize, where, order });
  };
    public getActiveAssetFlows = async () => {
      return this.repository.find({
        where: { status: AssetFlowStatus.ACTIVE },
        order: { flowName: "ASC" },
        select: ["id", "flowName"],
      });
    };
}
