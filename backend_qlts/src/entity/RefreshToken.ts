// entity/RefreshToken.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./User"

@Entity({ name: "refresh_tokens" })
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    token: string

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" }) // tên cột trong bảng
    user: User

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}
