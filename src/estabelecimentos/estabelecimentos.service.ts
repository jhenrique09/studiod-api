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

  async obterTodos(): Promise<Estabelecimento[]> {
    return await this.estabelecimentoRepository.find({
      relations: ['servicos'],
    });
  }

  async obterPorId(id: number): Promise<Estabelecimento> {
    return await this.estabelecimentoRepository.findOne({
      where: {
        id: id,
      },
      relations: ['servicos'],
    });
  }
}
