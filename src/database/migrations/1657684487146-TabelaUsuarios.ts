import { MigrationInterface, QueryRunner } from 'typeorm';

export class TabelaUsuarios1657684487146 implements MigrationInterface {
  name = 'TabelaUsuarios1657684487146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuarios"
         (
           "id"                       SERIAL                 NOT NULL,
           "nome"                     character varying(500) NOT NULL,
           "email"                    character varying      NOT NULL,
           "senha"                    character varying      NOT NULL,
           "senha_uso_unico"          character varying,
           "requer_atualizacao_senha" boolean                NOT NULL DEFAULT false,
           "telefone"                 character varying(11)  NOT NULL,
           "data_criacao"             TIMESTAMP              NOT NULL DEFAULT now(),
           "data_atualizacao"         TIMESTAMP              NOT NULL DEFAULT now(),
           CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"),
           CONSTRAINT "UQ_a74e0e525737469ee0a512505fe" UNIQUE ("telefone"),
           CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id")
         )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
