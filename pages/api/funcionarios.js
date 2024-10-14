import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const funcionarios = await prisma.funcionario.findMany();
        res.status(200).json(funcionarios);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar funcionários' });
      }
      break;

    case 'POST':
      const { nome, setor, turno, matricula } = req.body;
      try {
        const newFuncionario = await prisma.funcionario.create({
          data: {
            nome,
            setor,
            turno,
            matricula,
          },
        });
        res.status(201).json(newFuncionario);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
      }
      break;

    case 'PUT':
      const { id, updateData } = req.body;
      try {
        const updatedFuncionario = await prisma.funcionario.update({
          where: { matricula: id },
          data: {
            nome: updateData.nome,
            setor: updateData.setor,
            turno: updateData.turno,
            // Não atualizamos a matrícula, pois é o identificador único
          },
        });
        res.status(200).json(updatedFuncionario);
      } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Funcionário não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao atualizar funcionário' });
      }
      break;

    case 'DELETE':
      const { matriculaToDelete } = req.body;
      try {
        await prisma.funcionario.delete({
          where: { matricula: matriculaToDelete },
        });
        res.status(204).end();
      } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Funcionário não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao excluir funcionário' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}