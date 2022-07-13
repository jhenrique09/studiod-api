import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estabelecimento } from './entities/estabelecimento.entity';

@Injectable()
export class EstabelecimentosService {
  constructor(
    @InjectRepository(Estabelecimento)
    private estabelecimentoRepository: Repository<Estabelecimento>,
  ) {}

  async findAll(): Promise<Estabelecimento[]> {
    return await this.estabelecimentoRepository.find();
  }
}
