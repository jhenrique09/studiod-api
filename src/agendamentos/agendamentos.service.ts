import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EstabelecimentosService } from '../estabelecimentos/estabelecimentos.service';
import { Estabelecimento } from '../estabelecimentos/entities/estabelecimento.entity';
import * as moment from 'moment';
import { DataHorariosDto } from './dto/data-horarios.dto';
import {
  AgendamentosEstabelecimentoRetornoDto,
  AgendamentosRetornoDto,
} from './dto/agendamentos-retorno.dto';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepository: Repository<Agendamento>,
    private usuariosService: UsuariosService,
    private estabelecimentosService: EstabelecimentosService,
  ) {}

  async criar(criarAgendamentoDto: CriarAgendamentoDto, email: string) {
    if (!this.validarData(criarAgendamentoDto.data)) {
      throw new HttpException('Data inválida.', HttpStatus.BAD_REQUEST);
    }
    if (!this.validarHora(criarAgendamentoDto.hora)) {
      throw new HttpException('Hora inválida.', HttpStatus.BAD_REQUEST);
    }
    const estabelecimento: Estabelecimento =
      await this.estabelecimentosService.obterPorId(
        criarAgendamentoDto.id_estabelecimento,
      );
    if (!estabelecimento) {
      throw new HttpException(
        'Estabelecimento não encontrado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    criarAgendamentoDto.servicos.forEach((servico_id) => {
      if (
        !estabelecimento.servicos
          .map((servico) => servico.id)
          .includes(servico_id)
      ) {
        throw new HttpException(
          'Serviço não pertence ao estabelecimento.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    const minuto: number = parseInt(criarAgendamentoDto.hora.split(':')[1]);
    if (minuto != 0 && minuto != 30) {
      throw new HttpException('Hora inválida.', HttpStatus.BAD_REQUEST);
    }
    const dataHoraValida: boolean =
      (await this.calcularHorarios(estabelecimento)).filter(
        (dataHorario) =>
          dataHorario.data == criarAgendamentoDto.data &&
          dataHorario.horarios.includes(criarAgendamentoDto.hora),
      ).length > 0;
    if (!dataHoraValida) {
      throw new HttpException(
        'Não é possivel agendar para esta data.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const agendamento: Agendamento = new Agendamento();
    agendamento.usuario = await this.usuariosService.obterPorEmail(
      email,
      false,
    );
    agendamento.estabelecimento = estabelecimento;
    agendamento.data = criarAgendamentoDto.data;
    agendamento.hora = criarAgendamentoDto.hora;
    agendamento.servicos = criarAgendamentoDto.servicos;
    agendamento.status = 0;
    await this.agendamentoRepository.save(agendamento);
    return true;
  }

  async obterHorarios(idEstabelecimento: number): Promise<DataHorariosDto[]> {
    const estabelecimento: Estabelecimento =
      await this.estabelecimentosService.obterPorId(idEstabelecimento);
    if (!estabelecimento) {
      throw new HttpException(
        'Estabelecimento não encontrado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return await this.calcularHorarios(estabelecimento);
  }

  async calcularHorarios(
    estabelecimento: Estabelecimento,
  ): Promise<DataHorariosDto[]> {
    const hoje: string = moment(new Date()).format('DD/MM/YYYY');
    const datas: string[] = this.obterProximasDatas(7);
    let dataHorarios: DataHorariosDto[] = [];
    const horaAbertura = 8;
    const horaFechamento = 18;
    datas.forEach((data) => {
      const dataHorarioDto = new DataHorariosDto();
      dataHorarioDto.data = data;
      for (let i = horaAbertura; i <= horaFechamento; i++) {
        const dth = moment(new Date()).utc();
        dth.set({
          hour: i,
          minutes: 0,
          seconds: 0,
        });
        dataHorarioDto.horarios.push(dth.format('HH:mm'));
        if (i != horaFechamento) {
          dth.set({
            hour: i,
            minutes: 30,
            seconds: 0,
          });
          dataHorarioDto.horarios.push(dth.format('HH:mm'));
        }
      }
      dataHorarios.push(dataHorarioDto);
    });
    for (const dataHorario of dataHorarios) {
      if (dataHorario.data == hoje) {
        dataHorario.horarios = dataHorario.horarios.filter(
          (horario) =>
            moment() <=
            moment(dataHorario.data + ' ' + horario, 'DD/MM/YYYY HH:mm'),
        );
      }
      const horariosAgendados: string[] = (
        await this.agendamentoRepository.find({
          where: {
            data: dataHorario.data,
            status: 0,
            estabelecimento: {
              id: estabelecimento.id,
            },
          },
        })
      ).map((agendamento) => agendamento.hora);
      dataHorario.horarios = dataHorario.horarios.filter(
        (horario) =>
          horariosAgendados.filter(
            (horarioAgendado) => horarioAgendado == horario,
          ).length < 1,
      );
    }
    dataHorarios = dataHorarios.filter(
      (dataHorario) => dataHorario.horarios.length > 0,
    );
    return dataHorarios;
  }

  obterProximasDatas(qtd: number): string[] {
    const dataInicial = moment();
    const dataFinal = moment().add(qtd, 'days');
    const diff = dataFinal.diff(dataInicial, 'days');
    const datas: string[] = [];
    for (let i = 0; i <= diff; i++) {
      datas.push(moment(new Date()).add(i, 'days').format('DD/MM/YYYY'));
    }
    return datas;
  }

  async obterAgendamentosPorUsuario(
    email: string,
  ): Promise<AgendamentosRetornoDto[]> {
    const agendamentos: AgendamentosRetornoDto[] = [];
    (
      await this.agendamentoRepository.find({
        select: {
          estabelecimento: {
            id: true,
            nome: true,
          },
        },
        where: {
          usuario: {
            email: email,
          },
        },
        relations: ['estabelecimento', 'estabelecimento.servicos'],
      })
    ).forEach((agendamento) => {
      const agendamento_ = new AgendamentosRetornoDto();
      agendamento_.id = agendamento.id;
      agendamento_.data = agendamento.data;
      agendamento_.hora = agendamento.hora;
      agendamento_.status = agendamento.status;
      agendamento_.estabelecimento = new AgendamentosEstabelecimentoRetornoDto(
        agendamento.estabelecimento.id,
        agendamento.estabelecimento.nome,
      );
      agendamento_.servicos = [];
      agendamento.servicos.forEach((servico) => {
        agendamento_.servicos.push(
          agendamento.estabelecimento.servicos.filter(
            (s) => s.id == servico,
          )[0],
        );
      });
      agendamentos.push(agendamento_);
    });
    return agendamentos;
  }

  validarData(data) {
    return data.length == 10 && moment(data, 'DD/MM/YYYY').isValid();
  }

  validarHora(hora) {
    return hora.length == 5 && /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(hora);
  }
}
