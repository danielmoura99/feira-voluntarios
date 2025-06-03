/*
  Warnings:

  - A unique constraint covering the columns `[voluntarioId,data,horario,atividade,slot]` on the table `disponibilidades` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "disponibilidades_voluntarioId_data_horario_atividade_key";

-- AlterTable
ALTER TABLE "disponibilidades" ADD COLUMN     "slot" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidades_voluntarioId_data_horario_atividade_slot_key" ON "disponibilidades"("voluntarioId", "data", "horario", "atividade", "slot");
