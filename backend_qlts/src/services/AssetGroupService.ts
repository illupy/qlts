// AssetGroupService.ts
import { AppDataSource } from "../data-source";
import { AssetGroup } from "../entity/AssetGroup";
import { AssetGroupDto, CreateAssetGroupDto } from "../types/AssetGroupDto";
import InvalidateInputException from "../exceptions/InvalidateInputException";
import { BaseService } from "./BaseService";
import NotFoundException from "../exceptions/NotFoundException";
import ExistedException from "../exceptions/ExistedException";
import { Like, Not } from "typeorm";
import { AssetGroupPaginateRequest } from "../types/PageinateInfo";
import { AssetType } from "../entity/AssetType";
import CannotDeleteException from "../exceptions/CannotDeleteException";
import { AssetGroupStatus } from "../constant/AppConstant";
import { Response } from "express";
import ExcelJS from "exceljs";

export class AssetGroupService extends BaseService<AssetGroup> {
  constructor() {
    super(AppDataSource.getRepository(AssetGroup));
  }

  public generateNextAssetCode = async (): Promise<string> => {
    const last = await this.repository
      .createQueryBuilder("ag")
      .where("ag.groupCode LIKE :prefix", { prefix: "NTS%" })
      .orderBy("ag.groupCode", "DESC")
      .getOne();
    let nextNumber = 1;
    if (last) {
      const match = last.groupCode.match(/^NTS(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    return `NTS${String(nextNumber).padStart(3, "0")}`; // NTS001, NTS002...
  };

  /**
     * Create a new asset group
       - groupCode: max length 6 characters and do not contain special characters. Just letters both uppercase and lowercase, numbers, underscore and slash approved.
            If user does not input groupcode, auto generate a random groupCode with rules: "NTS" + 3-digit number ascesding from 001.
       - groupName: max length 50 characters.
     */
  public createAssetGroup = async (
    assetGroupInfo: CreateAssetGroupDto
  ): Promise<AssetGroupDto> => {
    // Validate fields in assetGroupInfo and follow the rules
    if (assetGroupInfo.groupCode) {
      if (
        assetGroupInfo.groupCode.length > 6 ||
        !/^[a-zA-Z0-9_\/]+$/.test(assetGroupInfo.groupCode)
      ) {
        throw new InvalidateInputException("Group Code");
      }
    } else {
      // Auto-generate groupCode if not provided, ascending from the last used code
      assetGroupInfo.groupCode = await this.generateNextAssetCode();
    }
    if (!assetGroupInfo.groupName || assetGroupInfo.groupName.length > 50) {
      throw new InvalidateInputException("Group Name");
    }
    // Check if groupCode or groupName already exists

    const existingGroupCode = await this.repository.findOne({
      where: [{ groupCode: assetGroupInfo.groupCode }],
    });
    const existingGroupName = await this.repository.findOne({
      where: [{ groupName: assetGroupInfo.groupName }],
    });
    if (existingGroupCode) {
      throw new ExistedException(
        `Asset Group with code ${assetGroupInfo.groupCode}`
      );
    }
    if (existingGroupName) {
      throw new ExistedException(
        `Asset Group with name ${assetGroupInfo.groupName}`
      );
    }
    const assetGroup = this.repository.create(assetGroupInfo);
    return await this.repository.save(assetGroup);
  };

  // get asset group paginated
  // public getAssetGroups = async (
  //   paginateRequest: PaginateRequest
  // ): Promise<PaginateInfo<AssetGroupDto>> => {
  //   return this.paginate(paginateRequest);
  // };

  public getAssetGroupById = async (id: number): Promise<AssetGroupDto> => {
    const assetGroup = await this.repository.findOneBy({ id });
    if (!assetGroup) {
      throw new NotFoundException(`Asset Group`);
    }
    //map assetGroup to AssetGroupDto
    const assetGroupDto: AssetGroupDto = {
      id: assetGroup.id,
      groupCode: assetGroup.groupCode,
      groupName: assetGroup.groupName,
      status: assetGroup.status,
    };
    return assetGroupDto;
  };

  public updateAssetGroup = async (
    id: number,
    newData: CreateAssetGroupDto
  ): Promise<AssetGroupDto> => {
    const assetGroup = await this.repository.findOneBy({ id });
    if (!assetGroup) {
      throw new NotFoundException(`Asset group with id ${id}`);
    }
    // Validate fields in newData and follow the rules
    if (newData.groupCode) {
      if (
        newData.groupCode.length > 6 ||
        !/^[a-zA-Z0-9_\/]+$/.test(newData.groupCode)
      ) {
        throw new InvalidateInputException("Group Code");
      }
    } else {
      // Auto-generate groupCode if not provided, ascending from the last used code
      newData.groupCode = await this.generateNextAssetCode();
    }
    if (!newData.groupName || newData.groupName.length > 50) {
      throw new InvalidateInputException("Group Name");
    }
    // Check if groupCode or groupName already exists
    // Note: We should not check the current assetGroup's code/name against itself
    const existingGroupCode = await this.repository.findOne({
      where: [{ groupCode: newData.groupCode, id: Not(id) }],
    });
    const existingGroupName = await this.repository.findOne({
      where: [{ groupName: newData.groupName, id: Not(id) }],
    });
    if (existingGroupCode) {
      throw new ExistedException(`Asset Group with code ${newData.groupCode}`);
    }
    if (existingGroupName) {
      throw new ExistedException(`Asset Group with name ${newData.groupName}`);
    }
    this.repository.merge(assetGroup, newData);
    return await this.repository.save(assetGroup);
  };
  public deleteAssetGroup = async (id: number): Promise<void> => {
    const assetGroup = await this.repository.findOneBy({ id });
    if (!assetGroup) {
      throw new NotFoundException(`Asset Group with id ${id}`);
    }

    // Kiểm tra xem có AssetType nào dùng group này không
    const assetTypeRepo = AppDataSource.getRepository(AssetType);
    const usedType = await assetTypeRepo.findOne({
      where: { groupId: { id } },
    });
    if (usedType) {
      throw new CannotDeleteException("Asset Group " + assetGroup.groupCode);
    }
    // just soft delete
    await this.repository
      .createQueryBuilder()
      .softDelete()
      .where("id = :id", { id })
      .execute();
    // await this.repository.remove(assetGroup);
  };

  public paginateAssetGroups = async (params: AssetGroupPaginateRequest) => {
    const {
      page,
      pageSize,
      searchGroupCode,
      searchGroupName,
      searchStatus,
      searchNote,
      orderBy,
      orderDirection,
    } = params;

    const where: any = {};
    if (searchGroupCode && searchGroupCode.trim() !== "") {
      where.groupCode = Like(`%${searchGroupCode}%`);
    }
    if (searchGroupName && searchGroupName.trim() !== "") {
      where.groupName = Like(`%${searchGroupName}%`);
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
  public getActiveAssetGroups = async () => {
    return this.repository.find({
      where: { status: AssetGroupStatus.ACTIVE },
      order: { groupName: "ASC" },
      select: ["id", "groupName"],
    });
  };
  public async exportAssetGroupTemplate(res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NHÓM TÀI SẢN");

    // Tiêu đề lớn
    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "NHÓM TÀI SẢN";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Header
    worksheet.addRow(["Mã nhóm", "Tên nhóm", "Trạng thái", "Ghi chú"]);
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEEFF" },
      };
    });

    // Dòng ví dụ
    worksheet.addRow(["NTS001", "Nhóm tài sản mẫu", "active", "Ví dụ ghi chú"]);
    worksheet.addRow(["NTS002", "Nhóm 2", "inactive", ""]);

    // Định dạng cột
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 30;

    // Thêm data validation cho cột Trạng thái
    [3, 4].forEach((rowNum) => {
      worksheet.getCell(`C${rowNum}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ['"active,inactive"'],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Sai giá trị",
        error: "Chỉ được chọn active hoặc inactive",
      };
    });

    // Style border cho các dòng dữ liệu, border ngang mờ
    [3, 4].forEach((rowNum) => {
      worksheet.getRow(rowNum).eachCell((cell) => {
        cell.border = {
          top: { style: "dotted", color: { argb: "FFAAAAAA" } },
          left: { style: "thin" },
          bottom: { style: "dotted", color: { argb: "FFAAAAAA" } },
          right: { style: "thin" },
        };
      });
    });

    // Border dưới cùng cho dòng cuối
    const lastRow = worksheet.getRow(4);
    lastRow.eachCell((cell) => {
      cell.border = {
        ...cell.border,
        bottom: { style: "thin" }, // Đậm hơn cho dòng cuối
      };
    });

    // Xuất file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=asset_group_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx.write(res);
    res.end();
  }
  public async exportAssetGroups(res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NHÓM TÀI SẢN");

    // Tiêu đề lớn
    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "NHÓM TÀI SẢN";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Header
    worksheet.addRow(["Mã nhóm", "Tên nhóm", "Trạng thái", "Ghi chú"]);
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEEFF" },
      };
    });

    // Dữ liệu thực tế
    const assetGroups = await this.repository.find();
    assetGroups.forEach((ag) => {
      worksheet.addRow([ag.groupCode, ag.groupName, ag.status, ag.note || ""]);
    });
    // Định dạng cột
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 30;

    // Style border cho các dòng dữ liệu, border ngang mờ
    const startRow = 3;
    const endRow = worksheet.lastRow.number;
    for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
      worksheet.getRow(rowNum).eachCell((cell) => {
        cell.border = {
          top: { style: "dotted", color: { argb: "FFAAAAAA" } },
          left: { style: "thin" },
          bottom: { style: "dotted", color: { argb: "FFAAAAAA" } },
          right: { style: "thin" },
        };
      });
      // Thêm data validation cho cột Trạng thái
      worksheet.getCell(`C${rowNum}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ['"active,inactive"'],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Sai giá trị",
        error: "Chỉ được chọn ACTIVE hoặc INACTIVE",
      };
    }

    // Border dưới cùng cho dòng cuối
    worksheet.getRow(endRow).eachCell((cell) => {
      cell.border = {
        ...cell.border,
        bottom: { style: "thin" },
      };
    });

    // Xuất file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=asset_groups.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx.write(res);
    res.end();
  }
  public async importAssetGroups(
    fileBuffer: Buffer
  ): Promise<{ success: number; errors: { row: number; message: string }[] }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];

    const errors: { row: number; message: string }[] = [];
    let success = 0;

    // Đọc từng dòng, bắt đầu từ dòng 3 (dòng 1 tiêu đề, dòng 2 header)
    for (let rowNum = 3; rowNum <= worksheet.lastRow.number; rowNum++) {
      const row = worksheet.getRow(rowNum);
      let groupCode = (row.getCell(1).value || "").toString().trim();
      const groupName = (row.getCell(2).value || "").toString().trim();
      const status = (row.getCell(3).value || "")
        .toString()
        .trim()
        .toLowerCase();
      const note = (row.getCell(4).value || "").toString().trim();

      // Bỏ qua dòng trống
      if (!groupCode && !groupName && !status && !note) continue;

      // Validate groupCode
      if (!groupCode) {
        groupCode = await this.generateNextAssetCode();
      }
      if (groupCode.length > 6 || !/^[a-zA-Z0-9_\/]+$/.test(groupCode)) {
        errors.push({ row: rowNum, message: "Mã nhóm không hợp lệ" });
        continue;
      }

      // Validate groupName
      if (!groupName) {
        errors.push({ row: rowNum, message: "Tên nhóm không được để trống" });
        continue;
      }
      if (groupName.length > 50) {
        errors.push({ row: rowNum, message: "Tên nhóm vượt quá 50 ký tự" });
        continue;
      }

      // Validate status
      if (status !== "active" && status !== "inactive") {
        errors.push({
          row: rowNum,
          message: "Trạng thái phải là ACTIVE hoặc INACTIVE",
        });
        continue;
      }

      // Kiểm tra trùng mã nhóm
      const existedCode = await this.repository.findOne({
        where: { groupCode },
      });
      if (existedCode) {
        errors.push({
          row: rowNum,
          message: `Mã nhóm '${groupCode}' đã tồn tại`,
        });
        continue;
      }

      // Kiểm tra trùng tên nhóm
      const existedName = await this.repository.findOne({
        where: { groupName },
      });
      if (existedName) {
        errors.push({
          row: rowNum,
          message: `Tên nhóm '${groupName}' đã tồn tại`,
        });
        continue;
      }

      // Nếu hợp lệ thì lưu
      const assetGroup = this.repository.create({
        groupCode,
        groupName,
        status: status === 'active'? AssetGroupStatus.ACTIVE : AssetGroupStatus.INACTIVE,
        note,
      });
      await this.repository.save(assetGroup);
      success++;
    }
    return { success, errors };
  }
}
