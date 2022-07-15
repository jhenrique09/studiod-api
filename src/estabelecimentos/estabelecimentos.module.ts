import { forwardRef, Module } from '@nestjs/common';
import { EstabelecimentosService } from './estabelecimentos.service';
import { EstabelecimentosController } from './estabelecimentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estabelecimento } from './entities/estabelecimento.entity';
import { AuthModule } from '../auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estabelecimento]),
    forwardRef(() => AuthModule),
    UsuariosModule,
  ],
  controllers: [EstabelecimentosController],
  providers: [EstabelecimentosService],
  exports: [EstabelecimentosService],
})
export class EstabelecimentosModule {}
