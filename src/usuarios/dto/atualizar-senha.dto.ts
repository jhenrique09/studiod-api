import { IsNotEmpty, MinLength } from 'class-validator';

export class AtualizarSenhaDto {
  @IsNotEmpty()
  senhaAtual: string;

  @IsNotEmpty()
  @MinLength(6)
  novaSenha: string;
}
