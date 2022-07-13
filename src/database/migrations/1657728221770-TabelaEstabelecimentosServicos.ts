import { MigrationInterface, QueryRunner } from "typeorm";

export class TabelaEstabelecimentosServicos1657728221770 implements MigrationInterface {
    name = 'TabelaEstabelecimentosServicos1657728221770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "servicos" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "estabelecimentoId" integer, CONSTRAINT "PK_91c99670ea2115d2028a48c5e0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estabelecimentos" ("id" SERIAL NOT NULL, "nome" character varying(500) NOT NULL, "telefone" character varying(11) NOT NULL, "endereco" character varying NOT NULL, "cep" character varying(8) NOT NULL, "bairro" character varying NOT NULL, "cidade" character varying NOT NULL, "uf" character varying(2) NOT NULL, "referencia" character varying NOT NULL, "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d53b7e443cbcf3ca911534c9ad2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "servicos" ADD CONSTRAINT "FK_00c437a0685fe6ec44118d99c64" FOREIGN KEY ("estabelecimentoId") REFERENCES "estabelecimentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "servicos" DROP CONSTRAINT "FK_00c437a0685fe6ec44118d99c64"`);
        await queryRunner.query(`DROP TABLE "estabelecimentos"`);
        await queryRunner.query(`DROP TABLE "servicos"`);
    }

}
