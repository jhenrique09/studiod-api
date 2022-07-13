import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1657661609326 implements MigrationInterface {
  name = 'migrations1657661609326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salt"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "pending_confirmation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "confirmation_token"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
            ADD "confirmation_token" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
            ADD "pending_confirmation" boolean NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
            ADD "salt" character varying NOT NULL`);
  }
}
