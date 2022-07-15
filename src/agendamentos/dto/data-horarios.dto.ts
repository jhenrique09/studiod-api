import { ApiProperty } from '@nestjs/swagger';

export class DataHorariosDto {
  @ApiProperty({
    example: '20/10/2022',
  })
  data: string;

  @ApiProperty({
    example: [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
    ],
  })
  horarios: string[] = [];
}
