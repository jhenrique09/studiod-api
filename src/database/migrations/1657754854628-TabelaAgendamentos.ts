import { MigrationInterface, QueryRunner } from 'typeorm';

export class TabelaAgendamentos1657754854628 implements MigrationInterface {
  name = 'TabelaAgendamentos1657754854628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "agendamentos"
                                 (
                                     "id"                SERIAL                NOT NULL,
                                     "data"              character varying(10) NOT NULL,
                                     "hora"              character varying(5)  NOT NULL,
                                     "status"            integer               NOT NULL,
                                     "servicos"          integer array NOT NULL,
                                     "data_atualizacao"  TIMESTAMP             NOT NULL DEFAULT now(),
                                     "usuarioId"         integer,
                                     "estabelecimentoId" integer,
                                     CONSTRAINT "PK_3890b7448ebc7efdfd1d43bf0c7" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(`ALTER TABLE "agendamentos"
            ADD CONSTRAINT "FK_0fa4d8ba241aee16baba9c6df98" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "agendamentos"
            ADD CONSTRAINT "FK_ea1deb3a12f142b0968ada040d3" FOREIGN KEY ("estabelecimentoId") REFERENCES "estabelecimentos" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_ea1deb3a12f142b0968ada040d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_0fa4d8ba241aee16baba9c6df98"`,
    );
    await queryRunner.query(`DROP TABLE "agendamentos"`);
  }
}
