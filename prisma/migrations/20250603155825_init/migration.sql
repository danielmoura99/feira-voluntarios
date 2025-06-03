-- CreateTable
CREATE TABLE "voluntarios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "casaEspirita" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voluntarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilidades" (
    "id" TEXT NOT NULL,
    "voluntarioId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "atividade" TEXT NOT NULL,

    CONSTRAINT "disponibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_codigo_key" ON "voluntarios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidades_voluntarioId_data_horario_atividade_key" ON "disponibilidades"("voluntarioId", "data", "horario", "atividade");

-- AddForeignKey
ALTER TABLE "disponibilidades" ADD CONSTRAINT "disponibilidades_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "voluntarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
