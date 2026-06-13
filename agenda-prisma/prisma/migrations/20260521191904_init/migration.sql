-- CreateTable
CREATE TABLE "Compromisso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "local" TEXT,
    "observacoes" TEXT,
    "inicio" DATETIME NOT NULL,
    "fim" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADO', 'CONCLUIDO', 'CANCELADO',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Compromisso_inicio_fim_status_idx" ON "Compromisso"("inicio", "fim", "status");
