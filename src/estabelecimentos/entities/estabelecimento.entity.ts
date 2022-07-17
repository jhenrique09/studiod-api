import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Servico } from './servico.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('estabelecimentos')
export class Estabelecimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false })
  @ApiProperty({
    example: 'Estabelecimento exemplo',
  })
  nome: string;

  @Column({ length: 11, nullable: false })
  @ApiProperty({
    example: '82988985689',
  })
  telefone: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 'Avenida Doutor Antônio Gomes de Barros, 45',
  })
  endereco: string;

  @Column({ nullable: false, length: 8 })
  @ApiProperty({
    example: '57040125',
  })
  cep: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 'Jatiúca',
  })
  bairro: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 'Maceió',
  })
  cidade: string;

  @Column({ nullable: false, length: 2 })
  @ApiProperty({
    example: 'AL',
  })
  uf: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 'Frente a padaria',
  })
  referencia: string;

  @Column({ nullable: true })
  url_imagem: string;

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;

  @OneToMany(() => Servico, (servico) => servico.estabelecimento, {
    eager: true,
  })
  servicos: Servico[];
}
