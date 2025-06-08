import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { BaseService } from "./BaseService";
import {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../types/ProductDto";
import { Partner } from "../entity/Partner";
import NotFoundException from "../exceptions/NotFoundException";
import ExistedException from "../exceptions/ExistedException";
import InvalidateInputException from "../exceptions/InvalidateInputException";
import { In, Not } from "typeorm";
import { AssetType } from "../entity/AssetType";
import { AssetFlow } from "../entity/AssetFlow";
import { Unit } from "../entity/Unit";
import { ProductPaginateRequest } from "../types/PageinateInfo";

export class ProductService extends BaseService<Product> {
  constructor() {
    super(AppDataSource.getRepository(Product));
  }

  // CREATE
  public async createProduct(params: CreateProductDto): Promise<ProductDto> {
    // Validate productCode
    if (params.productCode) {
      if (
        params.productCode.length > 10 ||
        !/^[a-zA-Z0-9_\/]+$/.test(params.productCode)
      ) {
        throw new InvalidateInputException("Product code");
      }
      const existed = await this.repository.findOne({
        where: { productCode: params.productCode },
      });
      if (existed) throw new ExistedException("Product code");
    } else {
      params.productCode = await this.generateNextProductCode();
    }

    // Validate productName
    if (!params.productName || params.productName.length > 255) {
      throw new InvalidateInputException("Product name");
    }
    const existedName = await this.repository.findOne({
      where: { productName: params.productName },
    });
    if (existedName) throw new ExistedException("Product name");

    // Validate partners
    let partners: Partner[] = [];
    if (params.partnerIds && params.partnerIds.length > 0) {
      const partnerRepo = AppDataSource.getRepository(Partner);
      partners = await partnerRepo.find({
        where: { id: In(params.partnerIds) },
      });
      if (partners.length !== params.partnerIds.length) {
        throw new NotFoundException("Some partners");
      }
    } else {
      throw new InvalidateInputException("Partner");
    }

    // Tạo mới
    const { partnerIds, ...productData } = params;
    const product = this.repository.create({
      ...productData,
      partners,
    });
    const saved = await this.repository.save(product);
    return this.toProductDto(saved);
  }

  // READ (get by id)
  public async getProductById(id: number): Promise<ProductDto> {
    const product = await this.repository.findOne({
      where: { id },
      relations: ["partners"],
    });
    if (!product) throw new NotFoundException("Product");
    return this.toProductDto(product);
  }

  // UPDATE
  public async updateProduct(
    id: number,
    params: UpdateProductDto
  ): Promise<ProductDto> {
    const product = await this.repository.findOne({
      where: { id },
      relations: ["partners"],
    });
    if (!product) throw new NotFoundException("Product");

    // Validate productCode (nếu có)
    if (params.productCode) {
      if (
        params.productCode.length > 10 ||
        !/^[a-zA-Z0-9_\/]+$/.test(params.productCode)
      ) {
        throw new InvalidateInputException("Product code");
      }
      const existed = await this.repository.findOne({
        where: { productCode: params.productCode, id: Not(id) },
      });
      if (existed) throw new ExistedException("Product code");
    } else {
      params.productCode = await this.generateNextProductCode();
    }

    // Validate productName (nếu có)
    if (!params.productName || (params.productName && params.productName.length > 255)) {
      throw new InvalidateInputException("Product name");
    }
    if (params.productName) {
      const existedName = await this.repository.findOne({
        where: { productName: params.productName, id: Not(id) },
      });
      if (existedName) throw new ExistedException("Product name");
    }

    // Validate partners
    let partners: Partner[] = [];
    if (params.partnerIds && params.partnerIds.length > 0) {
      const partnerRepo = AppDataSource.getRepository(Partner);
      partners = await partnerRepo.find({
        where: { id: In(params.partnerIds) },
      });
      if (partners.length !== params.partnerIds.length) {
        throw new NotFoundException("Some partners");
      }
    } else {
      throw new InvalidateInputException("Partner");
    }

    // Merge data
    const { partnerIds, ...updateData } = params;
    this.repository.merge(product, updateData);
    product.partners = partners;

    const saved = await this.repository.save(product);
    return this.toProductDto(saved);
  }

  // DELETE
  public async deleteProduct(id: number): Promise<void> {
    const product = await this.repository.findOneBy({ id });
    if (!product) throw new NotFoundException("Product");
    await this.repository
      .createQueryBuilder()
      .softDelete()
      .where("id = :id", { id })
      .execute();
  }
  // paginate products
  public async getPaginatedProducts(params: ProductPaginateRequest) {
    const {
      page,
      pageSize,
      searchProductCode,
      searchProductName,
      searchProductType,
      searchProductGroup,
      searchAssetType,
      searchAssetFlow,
      searchUnit,
      searchPartner,
      searchStatus,
      searchNote,
      orderBy,
      orderDirection,
    } = params;

    const query = this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.partners", "partner")
      .leftJoinAndMapOne(
        "product.assetType",
        AssetType,
        "assetType",
        "assetType.id = product.assetTypeId"
      )
      .leftJoinAndMapOne(
        "product.assetFlow",
        AssetFlow,
        "assetFlow",
        "assetFlow.id = product.assetFlowId"
      )
      .leftJoinAndMapOne(
        "product.unit",
        Unit,
        "unit",
        "unit.id = product.unitId"
      )
      .where("1=1");

    if (searchProductCode)
      query.andWhere("product.productCode LIKE :productCode", {
        productCode: `%${searchProductCode}%`,
      });
    if (searchProductName)
      query.andWhere("product.productName LIKE :productName", {
        productName: `%${searchProductName}%`,
      });
    if (searchProductType)
      query.andWhere("product.productType = :productType", {
        productType: searchProductType,
      });
    if (searchProductGroup)
      query.andWhere("product.productGroup = :productGroup", {
        productGroup: searchProductGroup,
      });
    if (searchAssetType)
      query.andWhere("assetType.typeName LIKE :assetType", {
        assetType: `%${searchAssetType}%`,
      });
    if (searchAssetFlow)
      query.andWhere("assetFlow.flowName LIKE :assetFlow", {
        assetFlow: `%${searchAssetFlow}%`,
      });
    if (searchUnit)
      query.andWhere("unit.name LIKE :unit", { unit: `%${searchUnit}%` });
    if (
      searchPartner &&
      Array.isArray(searchPartner) &&
      searchPartner.length > 0
    ) {
      query.andWhere("partner.id IN (:...partnerIds)", {
        partnerIds: searchPartner,
      });
    }
    if (searchStatus)
      query.andWhere("product.status = :status", { status: searchStatus });
    if (searchNote)
      query.andWhere("product.note LIKE :note", { note: `%${searchNote}%` });

    // Order
    if (orderBy === "assetType") {
      query.orderBy("assetType.typeName", orderDirection || "ASC");
    } else if (orderBy === "assetFlow") {
      query.orderBy("assetFlow.flowName", orderDirection || "ASC");
    } else if (orderBy === "unit") {
      query.orderBy("unit.name", orderDirection || "ASC");
    } else if (orderBy) {
      query.orderBy(`product.${orderBy}`, orderDirection || "ASC");
    } else {
      query.orderBy("product.id", "ASC");
    }

    query.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await query.getManyAndCount();

      const productIds = data.map((p) => p.id);
  let partnersMap = new Map<number, any[]>();
  if (productIds.length > 0) {
    const allPartners = await this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.partners", "partner")
      .where("product.id IN (:...ids)", { ids: productIds })
      .getMany();

    allPartners.forEach((p) => {
      partnersMap.set(p.id, p.partners || []);
    });
  }

  const result: ProductDto[] = data.map((product) =>
    this.toProductDtoJoined({
      ...product,
      partners: partnersMap.get(product.id) || [],
    })
  );

  return {
    data: result,
    total,
    page,
    pageSize,
  };
  }

  // Hàm này dùng cho dữ liệu đã join
  private toProductDtoJoined(product: any): ProductDto {
    return {
      id: product.id,
      productCode: product.productCode,
      productName: product.productName,
      productType: product.productType,
      productGroup: product.productGroup,
      assetTypeId: {
        id: product.assetTypeId,
        assetType: product.assetType?.typeName || "",
      },
      assetFlowId: {
        id: product.assetFlowId,
        assetFlow: product.assetFlow?.flowName || "",
      },
      unitId: {
        id: product.unitId,
        unit: product.unit?.name || "",
      },
      status: product.status,
      note: product.note,
      partners: (product.partners || []).map((p: any) => ({
        id: p.id,
        code: p.code,
        name: p.name,
      })),
    };
  }
  //convert Product entity to ProductDto
  private async toProductDto(product: Product): Promise<ProductDto> {
    // Join lấy tên assetType, assetFlow, unit
    const assetTypeRepo = AppDataSource.getRepository(AssetType);
    const assetType = await assetTypeRepo.findOne({
      where: { id: product.assetTypeId },
    });

    const assetFlowRepo = AppDataSource.getRepository(AssetFlow);
    const assetFlow = await assetFlowRepo.findOne({
      where: { id: product.assetFlowId },
    });

    const unitRepo = AppDataSource.getRepository(Unit);
    const unit = await unitRepo.findOne({ where: { id: product.unitId } });
    return {
      id: product.id,
      productCode: product.productCode,
      productName: product.productName,
      productType: product.productType,
      productGroup: product.productGroup,
      assetTypeId: {
        id: product.assetTypeId,
        assetType: assetType.typeName,
      },
      assetFlowId: {
        id: product.assetFlowId,
        assetFlow: assetFlow.flowName,
      },
      unitId: { id: product.unitId, unit: unit.name },
      status: product.status,
      note: product.note,
      partners: (product.partners || []).map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
      })),
    };
  }

  // Sinh mã tự động
  public async generateNextProductCode(): Promise<string> {
    const last = await this.repository
      .createQueryBuilder("product")
      .where("product.productCode LIKE :prefix", { prefix: "HHDV%" })
      .orderBy("product.productCode", "DESC")
      .getOne();
    let nextNum = 1;
    if (last && last.productCode.length >= 9) {
      console.log(last.productCode)
      const num = parseInt(last.productCode.slice(4), 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    return `HHDV${nextNum.toString().padStart(6, "0")}`;
  }
}
