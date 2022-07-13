import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarUsuarioDto {
  @MaxLength(500, {
    message: 'O nome deve ter no máximo 500 caracteres',
  })
  @ApiProperty()
  nome: string;

  @IsEmail({
    message: 'Informe um email válido',
  })
  @ApiProperty()
  email: string;

  @IsString({
    message: 'Informe uma senha válida',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  @ApiProperty()
  senha: string;

  @IsString({
    message: 'Informe um telefone válido com DDD',
  })
  @MinLength(11, {
    message: 'Informe um telefone válido com DDD',
  })
  @MaxLength(11, {
    message: 'Informe um telefone válido com DDD',
  })
  @ApiProperty()
  telefone: string;
}
