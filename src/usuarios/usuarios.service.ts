import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AtualizarSenhaDto } from './dto/atualizar-senha.dto';
import { AuthService } from '../auth/auth.service';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { generate } from 'generate-password';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailerService: MailerService,
  ) {}

  async registrar(registrarUsuarioDto: RegistrarUsuarioDto) {
    const usuarioExiste = await this.userRepository.count({
      where: [
        { email: registrarUsuarioDto.email },
        { telefone: registrarUsuarioDto.telefone },
      ],
    });
    if (usuarioExiste) {
      throw new HttpException(
        'Já existe um usuário com o email ou telefone informado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.salvar(registrarUsuarioDto);
    return { status: 1 };
  }

  async obterPorEmail(email: string, retornarSenha: boolean): Promise<Usuario> {
    const usuario: Usuario = await this.userRepository.findOne({
      where: { email: email },
    });
    if (usuario && !retornarSenha) {
      usuario.senha = null;
      usuario.senha_uso_unico = null;
    }
    return usuario;
  }

  async validarUsuario(
    email: string,
    data_atualizacao: string,
    verificar_atualizacao_senha: boolean,
  ): Promise<Usuario> {
    const usuario = await this.obterPorEmail(email, false);
    if (!usuario) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      const token_date: number = data_atualizacao
        ? new Date(data_atualizacao).getTime()
        : new Date().getTime();
      if (token_date != usuario.data_atualizacao.getTime()) {
        throw new HttpException('Token expirado', HttpStatus.UNAUTHORIZED);
      }
      if (verificar_atualizacao_senha && usuario.requer_atualizacao_senha) {
        throw new HttpException(
          'Alteração de senha necessária',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return usuario;
  }

  async obterHashSenha(senha: string) {
    return await bcrypt.hash(senha, 10);
  }

  async salvar(registrarUsuarioDto: RegistrarUsuarioDto) {
    const hash = await this.obterHashSenha(registrarUsuarioDto.senha);
    const usuario = new Usuario();
    usuario.nome = registrarUsuarioDto.nome;
    usuario.email = registrarUsuarioDto.email;
    usuario.senha = hash;
    usuario.telefone = registrarUsuarioDto.telefone;
    return await this.userRepository.save(usuario);
  }

  async atualizarSenha(email: string, atualizarSenhaDto: AtualizarSenhaDto) {
    if (atualizarSenhaDto.senhaAtual == atualizarSenhaDto.novaSenha) {
      throw new HttpException(
        'A senha atual não pode ser igual a nova senha.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const usuario: Usuario = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!(await bcrypt.compare(atualizarSenhaDto.senhaAtual, usuario.senha))) {
      throw new HttpException(
        'Senha atual inválida.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (
      usuario.senha_uso_unico &&
      !(await bcrypt.compare(
        atualizarSenhaDto.senhaAtual,
        usuario.senha_uso_unico,
      ))
    ) {
      throw new HttpException(
        'Senha atual inválida.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    usuario.senha = await this.obterHashSenha(atualizarSenhaDto.novaSenha);
    usuario.senha_uso_unico = null;
    usuario.requer_atualizacao_senha = false;
    usuario.data_atualizacao = new Date();
    await this.userRepository.save(usuario);
    return this.authService.login(usuario);
  }

  async atualizarRequerAtualizacao(user: Usuario, senha_uso_unico: boolean) {
    if (senha_uso_unico) {
      user.senha = user.senha_uso_unico;
      user.senha_uso_unico = null;
      user.requer_atualizacao_senha = true;
      user.data_atualizacao = new Date();
      await this.userRepository.save(user);
    } else if (user.senha_uso_unico != null) {
      user.requer_atualizacao_senha = false;
      user.senha_uso_unico = null;
      user.data_atualizacao = new Date();
      await this.userRepository.save(user);
    }
  }

  async recuperarSenha(recuperarSenhaDto: RecuperarSenhaDto) {
    const usuario: Usuario = await this.userRepository.findOne({
      where: {
        email: recuperarSenhaDto.email,
      },
    });
    if (!usuario) {
      throw new HttpException(
        'Não existe nenhum usuário com o email especificado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const senha_uso_unico = generate({
      length: 12,
      numbers: true,
    });
    usuario.senha_uso_unico = await this.obterHashSenha(senha_uso_unico);
    await this.userRepository.save(usuario);
    const mail = {
      to: usuario.email,
      from: process.env.MAIL_FROM,
      subject: 'Recuperação de senha',
      template: 'recuperar-senha',
      context: {
        senha: senha_uso_unico,
      },
    };
    await this.mailerService.sendMail(mail);
    return { status: 1 };
  }
}
