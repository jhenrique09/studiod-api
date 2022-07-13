import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private usersService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, senha: string): Promise<any> {
    const usuario: Usuario = await this.usersService.obterPorEmail(email, true);
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      await this.usersService.atualizarRequerAtualizacao(usuario, false);
      const { senha, senha_uso_unico, ...result } = usuario;
      return result;
    } else if (
      usuario &&
      usuario.senha_uso_unico &&
      (await bcrypt.compare(senha, usuario.senha_uso_unico))
    ) {
      await this.usersService.atualizarRequerAtualizacao(usuario, true);
      const { senha, senha_uso_unico, ...result } = usuario;
      return result;
    }
    return null;
  }

  login(usuario: Usuario) {
    const payload = {
      email: usuario.email,
      id: usuario.id,
      data_atualizacao: usuario.data_atualizacao,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
