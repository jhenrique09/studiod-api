import { ApiProperty } from '@nestjs/swagger';

export class NaoAutorizadoRetornoDto {
  @ApiProperty({
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Não autorizado',
  })
  message: string;
}
