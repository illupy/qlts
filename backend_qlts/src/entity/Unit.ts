// tạo enity typeorm cho bảng units, bảng có cấu trúc như sau:
// CREATE TABLE units (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(100) NOT NULL UNIQUE, 

//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   deleted_at DATETIME DEFAULT NULL
// );
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity("units")
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
