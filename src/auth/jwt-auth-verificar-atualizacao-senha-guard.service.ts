import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtAuthVerificarAtualizacaoSenhaGuard extends AuthGuard('jwt') {
  constructor(private readonly usersService: UsuariosService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    await this.usersService.validarUsuario(
      user.email,
      user.data_atualizacao,
      true,
    );
    return user;
  }
}
