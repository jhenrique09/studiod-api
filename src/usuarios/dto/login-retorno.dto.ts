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
}
