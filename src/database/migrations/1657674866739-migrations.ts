import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1657674866739 implements MigrationInterface {
  name = 'migrations1657674866739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
            ADD "one_time_password" character varying`);
    await queryRunner.query(`ALTER TABLE "user"
            ADD "force_password_update" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "force_password_update"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "one_time_password"`,
    );
  }
}
