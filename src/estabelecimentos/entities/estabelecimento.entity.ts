import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Servico } from './servico.entity';

@Entity('estabelecimentos')
export class Estabelecimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false })
  nome: string;

  @Column({ length: 11, nullable: false })
  telefone: string;

  @Column({ nullable: false })
  endereco: string;

  @Column({ nullable: false, length: 8 })
  cep: string;

  @Column({ nullable: false })
  bairro: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false, length: 2 })
  uf: string;

  @Column({ nullable: false })
  referencia: string;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;

  @OneToMany(() => Servico, (servico) => servico.estabelecimento, {
    eager: true,
  })
  servicos: Servico[];
}
