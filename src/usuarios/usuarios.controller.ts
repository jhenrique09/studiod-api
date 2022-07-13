import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AtualizarSenhaDto } from './dto/atualizar-senha.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly authService: AuthService,
  ) {}

  @Post('registrar')
  async registrar(@Body() registrarUsuarioDto: RegistrarUsuarioDto) {
    return await this.usersService.registrar(registrarUsuarioDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('autenticar')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getProfile(@Request() req) {
    return await this.usersService.obterPorEmail(req.user.email, false);
  }

  @UseGuards(JwtAuthGuard)
  @Post('atualizarSenha')
  async atualizarSenha(
    @Body() atualizarSenhaDto: AtualizarSenhaDto,
    @Request() req,
  ) {
    return await this.usersService.atualizarSenha(
      req.user.email,
      atualizarSenhaDto,
    );
  }

  @Post('recuperarSenha')
  async recuperarSenha(@Body() recuperarSenhaDto: RecuperarSenhaDto) {
    return await this.usersService.recuperarSenha(recuperarSenhaDto);
  }
}
