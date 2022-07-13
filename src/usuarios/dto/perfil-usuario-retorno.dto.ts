import { ApiProperty } from '@nestjs/swagger';

export class PerfilUsuarioRetornoDto {
  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Dados do perfil obtidos com sucesso.',
  })
  message: string;

  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'João',
  })
  nome: string;

  @ApiProperty({
    example: 'joao.silva@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: false,
  })
  requer_atualizacao_senha: boolean;

  @ApiProperty({
    example: '82988985689',
  })
  telefone: string;

  @ApiProperty({
    example: new Date(),
  })
  data_criacao: Date;

  @ApiProperty({
    example: new Date(),
  })
  data_atualizacao: Date;
}
