import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { AssetGroup } from "../entity/AssetGroup";
import { AssetType } from "../entity/AssetType";
import { AssetFlow } from "../entity/AssetFlow";
import { Partner } from "../entity/Partner";
import { Between, Brackets } from "typeorm";

export class DashboardService {
  private productRepo = AppDataSource.getRepository(Product);
  private partnerRepo = AppDataSource.getRepository(Partner);

  // 1. Biểu đồ cột: Số lượng tài sản theo nhóm, loại, dòng
  // 2. Biểu đồ tròn: Tỉ trọng phân bố tài sản theo nhóm, loại
  public async getProductCountByGroupTypeFlow() {
    // Theo nhóm
    const byGroup = await this.productRepo
      .createQueryBuilder("product")
      .select("product.productGroup", "groupId")
      .addSelect("COUNT(*)", "count")
      .groupBy("product.productGroup")
      .getRawMany();

    // Theo loại
    const byType = await this.productRepo
      .createQueryBuilder("product")
      .leftJoin(AssetType, "type", "type.id = product.assetTypeId")
      .select("type.typeName", "typeName")
      .addSelect("COUNT(*)", "count")
      .groupBy("product.assetTypeId")
      .getRawMany();

    // Theo dòng
    const byFlow = await this.productRepo
      .createQueryBuilder("product")
      .leftJoin(AssetFlow, "flow", "flow.id = product.assetFlowId")
      .select("flow.flowName", "flowName")
      .addSelect("COUNT(*)", "count")
      .groupBy("product.assetFlowId")
      .getRawMany();

    return { byGroup, byType, byFlow };
  }

  // 3. Biểu đồ đường: Biến động số lượng tài sản qua từng tháng
  // Trả về mảng [{month: 1, count: 10}, ...]
  public async getProductCountByMonth(year: number) {
    const result = [];
    const now = new Date();
    for (let month = 1; month <= 12; month++) {
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // cuối tháng
      if (endOfMonth > now) break;
      const count = await this.productRepo
        .createQueryBuilder("product")
        .withDeleted()
        .where("product.created_at <= :endOfMonth", { endOfMonth })
        .andWhere(
          new Brackets((qb) => {
            qb.where("product.deleted_at IS NULL").orWhere(
              "product.deleted_at > :endOfMonth",
              {
                endOfMonth,
              }
            );
          })
        )
        .getCount();
      result.push({ month, count });
    }

    return result;
  }

  // 4. Biểu đồ cột: Đánh giá mức độ hợp tác với đối tác (số lượng tài sản/hàng hóa)
  public async getProductCountByPartner() {
    // Giả sử mỗi product có nhiều partner (many-to-many)
    const result = await this.partnerRepo
      .createQueryBuilder("partner")
      .leftJoin("partner.products", "product")
      .select("partner.code", "partnerCode")
      .addSelect("partner.name", "partnerName")
      .addSelect("COUNT(product.id)", "count")
      .groupBy("partner.id")
      .addGroupBy("partner.name")
      .getRawMany();
    return result;
  }
}
