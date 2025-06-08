// tạo entyty typeorm cho Partner, bảng có cấu trúc như sau:
// CREATE TABLE partners (
//   id INT AUTO_INCREMENT PRIMARY KEY,

//   code VARCHAR(20) NOT NULL UNIQUE,    -- Mã đối tác
//   name VARCHAR(50) NOT NULL UNIQUE,    -- Tên đối tác

//   status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
//   note TEXT,

//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   deleted_at DATETIME DEFAULT NULL
// );
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from "typeorm";
import { PartnerStatus } from "../constant/AppConstant";
import { Product } from "./Product";
@Entity("partners")
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "code", length: 20, unique: true })
  code: string;

  @Column({ name: "name", length: 50, unique: true })
  name: string;

  @Column({
    name: "status",
    type: "enum",
    enum: PartnerStatus,
    default: PartnerStatus.ACTIVE,
  })
  status: PartnerStatus;

  @Column({ name: "note", type: "text", nullable: true })
  note: string;

  @ManyToMany(() => Product, (product) => product.partners)
  products: Product[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;
}
