// tạo entity cho bảng products
// mô tả product như sau:
// CREATE TABLE products (
//   id INT AUTO_INCREMENT PRIMARY KEY,

//   product_code VARCHAR(10) NOT NULL UNIQUE,                -- Mã hàng hóa/dịch vụ (VD: HHDV000001)
//   product_name VARCHAR(255) NOT NULL UNIQUE,                      -- Tên hàng hóa/dịch vụ

//   product_type ENUM('product', 'service') DEFAULT 'product',  -- Loại hàng hóa/dịch vụ
//   product_group ENUM(
//     'telecommunications', 'IT', 'RD', 'fixedasset',
//     'buildindorinfras', 'other'
// ),
//   asset_type_id INT NOT NULL,
//   asset_flow_id INT NOT NULL,

//   unit_id INT NOT NULL,                -- Liên kết bảng đơn vị tính

//   status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
//   note TEXT,                           -- Ghi chú

//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   deleted_at DATETIME DEFAULT NULL,

//   FOREIGN KEY (asset_type_id) REFERENCES asset_types(id),
//   FOREIGN KEY (asset_flow_id) REFERENCES asset_flows(id),
//   FOREIGN KEY (unit_id) REFERENCES units(id)
// );
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import {
  ProductType,
  ProductGroup,
  ProductStatus,
} from "../constant/AppConstant";
import { Partner } from "./Partner";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "product_code", type: "varchar", length: 10, unique: true })
  productCode: string;

  @Column({ name: "product_name", type: "varchar", length: 255, unique: true })
  productName: string;

  @Column({
    name: "product_type",
    type: "enum",
    enum: ProductType,
    default: ProductType.PRODUCT,
  })
  productType: ProductType;

  @Column({ name: "product_group", type: "enum", enum: ProductGroup })
  productGroup: ProductGroup;

  @Column({ name: "asset_type_id", type: "int" })
  assetTypeId: number;

  @Column({ name: "asset_flow_id", type: "int" })
  assetFlowId: number;

  @Column({ name: "unit_id", type: "int" })
  unitId: number;

  @Column({
    name: "status",
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Column({ type: "text", nullable: true })
  note: string;

  @ManyToMany(() => Partner, (partner) => partner.products)
  @JoinTable({
    name: "partner_supplier",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "partner_id",
      referencedColumnName: "id",
    },
  })
  partners: Partner[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;
}
