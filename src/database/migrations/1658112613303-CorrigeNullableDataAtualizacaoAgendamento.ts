import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrigeNullableDataAtualizacaoAgendamento1658112613303
  implements MigrationInterface
{
  name = 'CorrigeNullableDataAtualizacaoAgendamento1658112613303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agendamentos"
            ALTER COLUMN "data_atualizacao" SET DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agendamentos"
            ALTER COLUMN "data_atualizacao" DROP DEFAULT`);
  }
}
