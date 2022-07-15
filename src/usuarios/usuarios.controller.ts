import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Version,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AtualizarSenhaDto } from './dto/atualizar-senha.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegistrarUsuarioRetornoDto } from './dto/registrar-usuario-retorno.dto';
import { LoginRetornoDto } from './dto/login-retorno.dto';
import { PerfilUsuarioRetornoDto } from './dto/perfil-usuario-retorno.dto';
import { plainToClass } from 'class-transformer';
import { AtualizarSenhaRetornoDto } from './dto/atualizar-senha-retorno.dto';
import { RecuperarSenhaRetornoDto } from './dto/recuperar-senha-retorno.dto';
import { ErroInternoRetornoDto } from '../common/dto/erro-interno-retorno.dto';
import { RequisicaoInvalidaRetornoDto } from '../common/dto/requisicao-invalida-retorno.dto';
import { NaoAutorizadoRetornoDto } from '../common/dto/nao-autorizado-retorno.dto';

@Controller('usuarios')
@ApiTags('usuarios')
export class UsuariosController {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly authService: AuthService,
  ) {}

  @Version('1')
  @Post('registrar')
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: RegistrarUsuarioRetornoDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Requisição inválida',
    type: RequisicaoInvalidaRetornoDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErroInternoRetornoDto,
  })
  async registrar(
    @Body() registrarUsuarioDto: RegistrarUsuarioDto,
  ): Promise<RegistrarUsuarioRetornoDto> {
    const usuario = await this.usersService.registrar(registrarUsuarioDto);
    return {
      statusCode: 200,
      message: 'Usuário registrado com sucesso.',
      access_token: usuario.access_token,
    };
  }

  @Version('1')
  @UseGuards(LocalAuthGuard)
  @Post('autenticar')
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário autenticado com sucesso',
    type: LoginRetornoDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Não autorizado',
    type: NaoAutorizadoRetornoDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErroInternoRetornoDto,
  })
  login(@Request() req): LoginRetornoDto {
    return {
      statusCode: 200,
      message: 'Usuário autenticado com sucesso.',
      access_token: this.authService.login(req.user).access_token,
    };
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Não autorizado',
    type: NaoAutorizadoRetornoDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token JWT',
  })
  async getProfile(@Request() req): Promise<PerfilUsuarioRetornoDto> {
    return {
      statusCode: 200,
      message: 'Dados do perfil obtidos com sucesso.',
      ...plainToClass(
        PerfilUsuarioRetornoDto,
        await this.usersService.obterPorEmail(req.user.email, false),
        { exposeUnsetFields: false },
      ),
    };
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Post('atualizarSenha')
  @ApiResponse({
    status: 201,
    description: 'Senha atualizada com sucesso.',
    type: AtualizarSenhaRetornoDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Não autorizado',
    type: NaoAutorizadoRetornoDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErroInternoRetornoDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token JWT',
  })
  async atualizarSenha(
    @Body() atualizarSenhaDto: AtualizarSenhaDto,
    @Request() req,
  ): Promise<LoginRetornoDto> {
    return {
      statusCode: 201,
      message: 'Senha atualizada com sucesso.',
      ...(await this.usersService.atualizarSenha(
        req.user.email,
        atualizarSenhaDto,
      )),
    };
  }

  @Version('1')
  @Post('recuperarSenha')
  @ApiResponse({
    status: 201,
    description: 'Senha provisória enviada para o email cadastrado.',
    type: RecuperarSenhaRetornoDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErroInternoRetornoDto,
  })
  async recuperarSenha(
    @Body() recuperarSenhaDto: RecuperarSenhaDto,
  ): Promise<RecuperarSenhaRetornoDto> {
    await this.usersService.recuperarSenha(recuperarSenhaDto);
    return {
      statusCode: 201,
      message: 'Senha provisória enviada para o email cadastrado.',
    };
  }
}
