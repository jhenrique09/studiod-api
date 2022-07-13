import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estabelecimento } from './estabelecimento.entity';

@Entity('servicos')
export class Servico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @ManyToOne(
    () => Estabelecimento,
    (estabelecimento) => estabelecimento.servicos,
  )
  estabelecimento: Estabelecimento;
}
