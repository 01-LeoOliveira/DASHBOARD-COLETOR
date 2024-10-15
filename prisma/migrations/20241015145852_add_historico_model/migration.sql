-- CreateTable
CREATE TABLE `Historico` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioMatricula` VARCHAR(191) NOT NULL,
    `equipamentoNumeroSerie` VARCHAR(191) NOT NULL,
    `acao` VARCHAR(191) NOT NULL,
    `dataAcao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Historico` ADD CONSTRAINT `Historico_funcionarioMatricula_fkey` FOREIGN KEY (`funcionarioMatricula`) REFERENCES `Funcionario`(`matricula`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Historico` ADD CONSTRAINT `Historico_equipamentoNumeroSerie_fkey` FOREIGN KEY (`equipamentoNumeroSerie`) REFERENCES `Equipamento`(`numeroSerie`) ON DELETE RESTRICT ON UPDATE CASCADE;
