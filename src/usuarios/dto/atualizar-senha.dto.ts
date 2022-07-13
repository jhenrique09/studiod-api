import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AtualizarSenhaDto {
  @IsString({
    message: 'Informe uma senha válida',
  })
  senhaAtual: string;

  @IsString({
    message: 'Informe uma nova senha válida',
  })
  @MinLength(6, {
    message: 'A nova senha deve ter no mínimo 6 caracteres',
  })
  novaSenha: string;
}
