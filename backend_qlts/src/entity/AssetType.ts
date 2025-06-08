// Create entity for AssetType
// CREATE TABLE asset_types (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   type_code VARCHAR(10) NOT NULL UNIQUE,   -- Mã loại tài sản
//   type_name VARCHAR(50) NOT NULL UNIQUE,          -- Tên loại tài sản
//   group_id INT NOT NULL,                   -- Nhóm tài sản (FK)
//   management_type ENUM('quantity', 'code') NOT NULL DEFAULT 'quantity',
//   status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
//   note TEXT,                               -- Ghi chú
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   deleted_at TIMESTAMP NULL DEFAULT NULL,         -- Soft delete

//   CONSTRAINT fk_asset_type_group FOREIGN KEY (group_id)
//     REFERENCES asset_groups(id)
// );
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { AssetGroup } from "./AssetGroup";
import { AssetTypeStatus, ManagementType } from "../constant/AppConstant";
@Entity("asset_types")
export class AssetType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "type_code", length: 10, unique: true })
  typeCode: string; // Mã loại tài sản

  @Column({ name: "type_name", length: 50, unique: true })
  typeName: string; // Tên loại tài sản

  @ManyToOne(() => AssetGroup)
  @JoinColumn({ name: "group_id" })
  groupId: AssetGroup;

  @Column({
    type: "enum",
    name: "management_type",
    enum: ManagementType,
    default: ManagementType.QUANTITY,
  })
  managementType: ManagementType;

  @Column({
    type: "enum",
    enum: AssetTypeStatus,
    default: AssetTypeStatus.ACTIVE,
  })
  status: AssetTypeStatus;

  @Column({ type: "text", nullable: true })
  note?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;
}
