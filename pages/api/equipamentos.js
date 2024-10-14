import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const equipamentos = await prisma.equipamento.findMany();
        res.status(200).json(equipamentos);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar equipamentos' });
      }
      break;

    case 'POST':
      const { nome, numeroSerie } = req.body;
      try {
        const newEquipamento = await prisma.equipamento.create({
          data: {
            nome,
            numeroSerie,
          },
        });
        res.status(201).json(newEquipamento);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar equipamento' });
      }
      break;

    case 'PUT':
      const { id, updateData } = req.body;
      try {
        const updatedEquipamento = await prisma.equipamento.update({
          where: { numeroSerie: id },
          data: {
            nome: updateData.nome,
            // Não atualizamos o número de série, pois é o identificador único
          },
        });
        res.status(200).json(updatedEquipamento);
      } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao atualizar equipamento' });
      }
      break;

    case 'DELETE':
      const { numeroSerieToDelete } = req.body;
      try {
        await prisma.equipamento.delete({
          where: { numeroSerie: numeroSerieToDelete },
        });
        res.status(204).end();
      } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Equipamento não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao excluir equipamento' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}