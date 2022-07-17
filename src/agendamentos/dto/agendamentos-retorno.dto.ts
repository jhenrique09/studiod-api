import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Servico } from '../../estabelecimentos/entities/servico.entity';

export class AgendamentosRetornoDto {
  id: number;

  estabelecimento: AgendamentosEstabelecimentoRetornoDto;

  @ApiProperty({
    example: '20/10/2022',
  })
  data: string;

  @ApiProperty({
    example: '08:00',
  })
  hora: string;

  @ApiProperty({
    example: 0,
  })
  status: number;

  @ApiProperty({
    example: [
      new Servico(1, 'Serviço teste'),
      new Servico(2, 'Serviço teste 2'),
    ],
  })
  servicos: Servico[];

  @ApiHideProperty()
  data_atualizacao: Date;
}

export class AgendamentosEstabelecimentoRetornoDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Estabelecimento exemplo',
  })
  nome: string;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }
}
