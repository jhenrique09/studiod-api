import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';
import {
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NaoAutorizadoRetornoDto } from '../common/dto/nao-autorizado-retorno.dto';
import { DataHorariosDto } from './dto/data-horarios.dto';
import { ErroInternoRetornoDto } from '../common/dto/erro-interno-retorno.dto';
import { Agendamento } from './entities/agendamento.entity';
import { CriarAgendamentoRetornoDto } from './dto/criar-agendamento-retorno.dto';
import { JwtAuthVerificarAtualizacaoSenhaGuard } from '../auth/jwt-auth-verificar-atualizacao-senha-guard.service';

@Controller('agendamentos')
@ApiTags('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Version('1')
  @Post()
  @UseGuards(JwtAuthVerificarAtualizacaoSenhaGuard)
  @ApiResponse({
    status: 201,
    description: 'Agendamento criado com sucesso.',
    type: CriarAgendamentoRetornoDto,
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
  async criarAgendamento(
    @Request() req,
    @Body() criarAgendamentoDto: CriarAgendamentoDto,
  ): Promise<CriarAgendamentoRetornoDto> {
    await this.agendamentosService.criar(criarAgendamentoDto, req.user.email);
    return {
      statusCode: 201,
      message: 'Agendamento criado com sucesso.',
    };
  }

  @Version('1')
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Não autorizado',
    type: NaoAutorizadoRetornoDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token JWT',
  })
  async obterAgendamentos(@Request() req): Promise<Agendamento[]> {
    return await this.agendamentosService.obterAgendamentosPorUsuario(
      req.user.email,
    );
  }

  @Version('1')
  @Get('horarios/:id_estabelecimento')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Não autorizado',
    type: NaoAutorizadoRetornoDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token JWT',
  })
  async obterHorarios(
    @Request() req,
    @Param('id_estabelecimento') idEstabelecimento: number,
  ): Promise<DataHorariosDto[]> {
    return await this.agendamentosService.obterHorarios(idEstabelecimento);
  }
}
