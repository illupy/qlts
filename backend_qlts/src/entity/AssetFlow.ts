// mô tả luồng tài sản như sau:
// CREATE TABLE asset_flows (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   flow_code VARCHAR(6) NOT NULL UNIQUE,     -- Mã dòng tài sản
//   flow_name VARCHAR(50) NOT NULL UNIQUE,           -- Tên dòng tài sản
//   status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
//   note TEXT,                             -- Ghi chú
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   deleted_at TIMESTAMP NULL DEFAULT NULL
// );
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { AssetFlowStatus } from "../constant/AppConstant";

@Entity("asset_flows")
export class AssetFlow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "flow_code", length: 6, unique: true })
  flowCode: string;

  @Column({ name: "flow_name", length: 50, unique: true })
  flowName: string;

  @Column({
    name: "status",
    type: "enum",
    enum: AssetFlowStatus,
    default: AssetFlowStatus.ACTIVE,
  })
  status: AssetFlowStatus;

  @Column({ name: "note", type: "text", nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}