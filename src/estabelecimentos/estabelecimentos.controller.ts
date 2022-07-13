import { Controller, Get } from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';
import { ApiTags } from '@nestjs/swagger';
import { Estabelecimento } from './entities/estabelecimento.entity';

@Controller('estabelecimentos')
@ApiTags('estabelecimentos')
export class EstabelecimentosController {
  constructor(
    private readonly estabelecimentosService: EstabelecimentosService,
  ) {}

  @Get()
  async findAll(): Promise<Estabelecimento[]> {
    return await this.estabelecimentosService.findAll();
  }
}
