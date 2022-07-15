import { Module } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { AgendamentosController } from './agendamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { EstabelecimentosModule } from '../estabelecimentos/estabelecimentos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento]),
    UsuariosModule,
    EstabelecimentosModule,
  ],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentosModule {}
