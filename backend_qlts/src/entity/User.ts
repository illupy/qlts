import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { UserRole } from "../constant/AppConstant"

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "full_name", length: 255 })
    fullName: string

    @Column({ length: 255 })
    email: string

    @Column({ length: 255 })
    password: string

    @Column({
        type: "enum",
        enum: ['admin', 'bul', 'user']
    })
    role: UserRole

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date
}
