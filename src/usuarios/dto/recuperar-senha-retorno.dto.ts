import { ApiProperty } from '@nestjs/swagger';

export class RecuperarSenhaRetornoDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Senha provisória enviada para o email cadastrado.',
  })
  message: string;
}
