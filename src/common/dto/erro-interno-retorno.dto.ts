import { ApiProperty } from '@nestjs/swagger';

export class ErroInternoRetornoDto {
  @ApiProperty({
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Mensagem de erro',
  })
  message: string;
}
