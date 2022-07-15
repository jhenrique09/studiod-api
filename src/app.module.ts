import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EstabelecimentosModule } from './estabelecimentos/estabelecimentos.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
    }),
    MailerModule.forRoot({
      template: {
        dir: __dirname + '/../mail_templates',
        adapter: new HandlebarsAdapter(),
        options: {
          extName: '.hbs',
          layoutsDir: __dirname + '/../mail_templates',
        },
      },
      transport: process.env.MAIL_TRANSPORT,
    }),
    UsuariosModule,
    AuthModule,
    EstabelecimentosModule,
    AgendamentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
