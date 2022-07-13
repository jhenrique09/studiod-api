import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false })
  nome: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: true })
  senha_uso_unico: string;

  @Column({ nullable: false, default: false })
  requer_atualizacao_senha: boolean;

  @Column({ length: 11, nullable: false, unique: true })
  telefone: string;

  @CreateDateColumn()
  data_criacao: Date;

  @Column({ nullable: false, default: () => 'now()' })
  data_atualizacao: Date;
}
