// PartnerService.ts
import { AppDataSource } from "../data-source";
import { Partner } from "../entity/Partner";
import { PartnerDto, CreatePartnerDto } from "../types/PartnerDto";
import InvalidateInputException from "../exceptions/InvalidateInputException";
import { BaseService } from "./BaseService";
import NotFoundException from "../exceptions/NotFoundException";
import ExistedException from "../exceptions/ExistedException";
import { Like, Not } from "typeorm";
import { PartnerPaginateRequest } from "../types/PageinateInfo";
import CannotDeleteException from "../exceptions/CannotDeleteException";
import { PartnerStatus } from "../constant/AppConstant";
import { Product } from "../entity/Product";

export class PartnerService extends BaseService<Partner> {
  constructor() {
    super(AppDataSource.getRepository(Partner));
  }

  /**
     * Create a new partner
       - Code: max length 10 characters and do not contain special characters. Just letters both uppercase and lowercase, numbers, underscore and slash approved.
       - Name: max length 50 characters.
     */
  public createPartner = async (
    partnerInfo: CreatePartnerDto
  ): Promise<PartnerDto> => {
    // Validate fields in partnerInfo and follow the rules
    if (partnerInfo.code) {
      if (
        partnerInfo.code.length > 10 ||
        !/^[a-zA-Z0-9_\/]+$/.test(partnerInfo.code)
      ) {
        throw new InvalidateInputException("Partner Code");
      }
    }
    if (!partnerInfo.name || partnerInfo.name.length > 50) {
      throw new InvalidateInputException("Partner name");
    }
    // Check if Code or Name already exists

    const existingCode = await this.repository.findOne({
      where: [{ code: partnerInfo.code }],
    });
    if (existingCode) {
      throw new ExistedException(`Partner with code ${partnerInfo.code}`);
    }
    const existingName = await this.repository.findOne({
      where: [{ name: partnerInfo.name }],
    });
    if (existingName) {
      throw new ExistedException(`Partner with name ${partnerInfo.name}`);
    }
    const partner = this.repository.create(partnerInfo);
    return await this.repository.save(partner);
  };

  public getPartnerById = async (id: number): Promise<PartnerDto> => {
    const partner = await this.repository.findOneBy({ id });
    if (!partner) {
      throw new NotFoundException(`Partner`);
    }
    //map partner to PartnerDto
    const partnerDto: PartnerDto = {
      id: partner.id,
      code: partner.code,
      name: partner.name,
      status: partner.status,
    };
    return partnerDto;
  };

  public updatePartner = async (
    id: number,
    newData: CreatePartnerDto
  ): Promise<PartnerDto> => {
    const partner = await this.repository.findOneBy({ id });
    if (!partner) {
      throw new NotFoundException(`Partner with id ${id}`);
    }
    // Validate fields in newData and follow the rules
    if (newData.code) {
      if (newData.code.length > 6 || !/^[a-zA-Z0-9_\/]+$/.test(newData.code)) {
        throw new InvalidateInputException("Partner Code");
      }
    }
    if (!newData.name || newData.name.length > 50) {
      throw new InvalidateInputException("Partner Name");
    }
    // Check if code or name already exists
    // Note: We should not check the current partner's code/name against itself
    const existingCode = await this.repository.findOne({
      where: [{ code: newData.code, id: Not(id) }],
    });
    const existingName = await this.repository.findOne({
      where: [{ name: newData.name, id: Not(id) }],
    });
    if (existingCode) {
      throw new ExistedException(`Partner with code ${newData.code}`);
    }
    if (existingName) {
      throw new ExistedException(`Partner with name ${newData.name}`);
    }
    this.repository.merge(partner, newData);
    return await this.repository.save(partner);
  };
  public deletePartner = async (id: number): Promise<void> => {
    const partner = await this.repository.findOne({
      where: { id },
      relations: ["products"], // Lấy luôn danh sách products liên kết
    });
    if (!partner) {
      throw new NotFoundException(`Partner with id ${id}`);
    }

    // Kiểm tra xem có Product thuộc nhà cung cấp này
    if (partner.products && partner.products.length > 0) {
      throw new CannotDeleteException("Partner");
    }

    // just soft delete
    await this.repository
      .createQueryBuilder()
      .softDelete()
      .where("id = :id", { id })
      .execute();
  };

  public paginatePartners = async (params: PartnerPaginateRequest) => {
    const {
      page,
      pageSize,
      searchCode,
      searchName,
      searchStatus,
      searchNote,
      orderBy,
      orderDirection,
    } = params;

    const where: any = {};
    if (searchCode && searchCode.trim() !== "") {
      where.code = Like(`%${searchCode}%`);
    }
    if (searchName && searchName.trim() !== "") {
      where.name = Like(`%${searchName}%`);
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
  public getActivePartners = async () => {
    return this.repository.find({
      where: { status: PartnerStatus.ACTIVE },
      order: { name: "ASC" },
      select: ["id", "name"],
    });
  };
}
