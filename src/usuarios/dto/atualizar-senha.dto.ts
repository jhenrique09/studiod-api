import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarSenhaDto {
  @IsString({
    message: 'Informe uma senha válida',
  })
  @ApiProperty({
    example: '123456',
  })
  senhaAtual: string;

  @IsString({
    message: 'Informe uma nova senha válida',
  })
  @MinLength(6, {
    message: 'A nova senha deve ter no mínimo 6 caracteres',
  })
  @ApiProperty({
    example: '12345678',
  })
  novaSenha: string;
}
