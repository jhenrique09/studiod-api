import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';
import { ApiHeader, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Estabelecimento } from './entities/estabelecimento.entity';
import { NaoAutorizadoRetornoDto } from '../common/dto/nao-autorizado-retorno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('estabelecimentos')
@ApiTags('estabelecimentos')
export class EstabelecimentosController {
  constructor(
    private readonly estabelecimentosService: EstabelecimentosService,
  ) {}

  @Get()
  @Version('1')
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
  async findAll(): Promise<Estabelecimento[]> {
    return await this.estabelecimentosService.obterTodos();
  }
}
