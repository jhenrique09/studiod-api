import { ApiProperty } from '@nestjs/swagger';

export class RequisicaoInvalidaRetornoDto {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Mensagem de erro',
  })
  message: string;
}
