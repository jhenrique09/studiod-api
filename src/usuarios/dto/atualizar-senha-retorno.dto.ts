import { ApiProperty } from '@nestjs/swagger';

export class AtualizarSenhaRetornoDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Senha atualizada com sucesso.',
  })
  message: string;

  @ApiProperty({
    example: 'JWT token',
  })
  access_token: string;
}
