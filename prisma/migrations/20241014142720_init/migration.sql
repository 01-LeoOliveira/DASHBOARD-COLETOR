-- CreateTable
CREATE TABLE `Funcionario` (
    `matricula` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `setor` VARCHAR(191) NOT NULL,
    `turno` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`matricula`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipamento` (
    `numeroSerie` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`numeroSerie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
