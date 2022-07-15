import { ArrayMinSize, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CriarAgendamentoDto {
  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  id_estabelecimento: number;

  @ApiProperty({
    example: '20/10/2022',
  })
  @IsString({
    message: 'Informe uma data válida',
  })
  data: string;

  @ApiProperty({
    example: '08:00',
  })
  @IsString({
    message: 'Informe uma hora válida',
  })
  hora: string;

  @ArrayMinSize(1, {
    message: 'Informe ao menos um serviço válido',
  })
  @Type(() => Number)
  @ApiProperty({
    example: [1, 2, 5],
  })
  servicos: number[];
}
