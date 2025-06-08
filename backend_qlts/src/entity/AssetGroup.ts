// tạo entity typeorm cho AssetGroup, bảng có cấu trúc như sau:
// CREATE TABLE asset_groups (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   group_code VARCHAR(6) NOT NULL UNIQUE,         -- Mã nhóm
//   group_name VARCHAR(50) NOT NULL UNIQUE,               -- Tên nhóm
//   status ENUM('active', 'inactive') NOT NULL DEFAULT 'active', -- Trạng thái
//   note TEXT,                                     -- Ghi chú
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   deleted_at TIMESTAMP NULL DEFAULT NULL         -- Soft delete
// );
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { AssetGroupStatus } from '../constant/AppConstant';

@Entity({ name: 'asset_groups' })
export class AssetGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_code', length: 6, unique: true })
  groupCode: string;

  @Column({ name: 'group_name', length: 50, unique: true })
  groupName: string;

  @Column({
    type: 'enum',
    enum: AssetGroupStatus,
    default: AssetGroupStatus.ACTIVE,
  })
  status: AssetGroupStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
