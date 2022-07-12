import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: false, select: false })
  @Exclude({ toPlainOnly: true })
  salt: string;

  @Column({ length: 11, nullable: false, unique: true })
  phone: string;

  @Column({ nullable: false })
  pending_confirmation: boolean;

  @Column({ nullable: false, select: false })
  @Exclude({ toPlainOnly: true })
  confirmation_token: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
