import { ApiProperty } from '@nestjs/swagger';

export class CriarAgendamentoRetornoDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Agendamento criado com sucesso.',
  })
  message: string;
}
