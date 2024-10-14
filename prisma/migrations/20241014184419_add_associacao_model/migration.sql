-- CreateTable
CREATE TABLE `Associacao` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioMatricula` VARCHAR(191) NOT NULL,
    `equipamentoNumeroSerie` VARCHAR(191) NOT NULL,
    `dataAssociacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Associacao_funcionarioMatricula_equipamentoNumeroSerie_key`(`funcionarioMatricula`, `equipamentoNumeroSerie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Associacao` ADD CONSTRAINT `Associacao_funcionarioMatricula_fkey` FOREIGN KEY (`funcionarioMatricula`) REFERENCES `Funcionario`(`matricula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Associacao` ADD CONSTRAINT `Associacao_equipamentoNumeroSerie_fkey` FOREIGN KEY (`equipamentoNumeroSerie`) REFERENCES `Equipamento`(`numeroSerie`) ON DELETE RESTRICT ON UPDATE CASCADE;
