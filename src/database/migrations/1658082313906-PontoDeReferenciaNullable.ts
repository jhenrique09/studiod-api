import { MigrationInterface, QueryRunner } from 'typeorm';

export class PontoDeReferenciaNullable1658082313906
  implements MigrationInterface
{
  name = 'PontoDeReferenciaNullable1658082313906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "estabelecimentos"
            ALTER COLUMN "referencia" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "estabelecimentos"
            ALTER COLUMN "referencia" SET NOT NULL`);
  }
}
