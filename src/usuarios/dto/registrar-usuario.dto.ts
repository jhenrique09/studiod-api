import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegistrarUsuarioDto {
  @MaxLength(500)
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  telefone: string;
}
