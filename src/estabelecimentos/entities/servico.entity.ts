import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Estabelecimento } from './estabelecimento.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('servicos')
export class Servico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: 'Serviço teste',
  })
  nome: string;

  @ManyToOne(
    () => Estabelecimento,
    (estabelecimento) => estabelecimento.servicos,
  )
  @ApiHideProperty()
  estabelecimento: Estabelecimento;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }
}
