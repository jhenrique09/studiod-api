import { ApiProperty } from '@nestjs/swagger';

export class LoginRetornoDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Usuário autenticado com sucesso.',
  })
  message: string;

  @ApiProperty({
    example: 'JWT token',
  })
  access_token: string;

  @ApiProperty({
    example: 'Indica se o usuário precisa realizar atualização de senha',
  })
  requer_atualizacao_senha: boolean;
}
