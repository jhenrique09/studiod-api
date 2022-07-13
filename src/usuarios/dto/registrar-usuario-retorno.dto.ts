import { ApiProperty } from '@nestjs/swagger';

export class RegistrarUsuarioRetornoDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Usuário registrado com sucesso',
  })
  message: string;

  @ApiProperty({
    example: 'JWT token',
  })
  access_token: string;
}
