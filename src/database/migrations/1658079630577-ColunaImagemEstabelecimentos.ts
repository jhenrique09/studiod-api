import { MigrationInterface, QueryRunner } from "typeorm";

export class ColunaImagemEstabelecimentos1658079630577 implements MigrationInterface {
    name = 'ColunaImagemEstabelecimentos1658079630577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estabelecimentos" ADD "url_imagem" character varying`);
        await queryRunner.query(`ALTER TABLE "agendamentos" ALTER COLUMN "data_atualizacao" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agendamentos" ALTER COLUMN "data_atualizacao" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "estabelecimentos" DROP COLUMN "url_imagem"`);
    }

}
