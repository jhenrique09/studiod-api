import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Estabelecimento } from '../../estabelecimentos/entities/estabelecimento.entity';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, {
    eager: false,
  })
  @JoinColumn()
  @ApiHideProperty()
  usuario: Usuario;

  @ManyToOne(() => Estabelecimento, {
    eager: false,
  })
  @JoinColumn()
  @ApiHideProperty()
  estabelecimento: Estabelecimento;

  @Column({ nullable: false, length: 10 })
  @ApiProperty({
    example: '20/10/2022',
  })
  data: string;

  @Column({ nullable: false, length: 5 })
  @ApiProperty({
    example: '08:00',
  })
  hora: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 0,
  })
  status: number;

  @Column({
    name: 'servicos',
    array: true,
    type: 'int',
    transformer: {
      from: (value) => value.map(Number),
      to: (value) => value,
    },
  })
  servicos: number[];

  @UpdateDateColumn()
  data_atualizacao: Date;
}
