import { Controller, Get } from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';

@Controller('estabelecimentos')
export class EstabelecimentosController {
  constructor(
    private readonly estabelecimentosService: EstabelecimentosService,
  ) {}

  @Get()
  findAll() {
    return this.estabelecimentosService.findAll();
  }
}
