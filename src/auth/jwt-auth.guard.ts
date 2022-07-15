import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly usuariosService: UsuariosService) {
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
    await this.usuariosService.validarUsuario(
      user.email,
      user.data_atualizacao,
      false,
    );
    return user;
  }
}
