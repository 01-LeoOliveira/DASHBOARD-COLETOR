import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv'; // Biblioteca para converter JSON para CSV

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST' && req.body.action === 'export') {
    return handleExportCsv(req, res);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// Função existente para buscar histórico
async function handleGet(req, res) {
  try {
    const historico = await prisma.historico.findMany({
      include: {
        funcionario: {
          select: {
            nome: true,
            matricula: true,
          },
        },
        equipamento: {
          select: {
            nome: true,
            numeroSerie: true,
          },
        },
      },
      orderBy: [
        {
          dataAcao: 'desc',
        },
        {
          id: 'desc',
        },
      ],
    });

    const formattedHistorico = historico.map((item) => ({
      id: item.id,
      funcionario: {
        nome: item.funcionario.nome,
        matricula: item.funcionario.matricula,
      },
      equipamento: {
        nome: item.equipamento.nome,
        numeroSerie: item.equipamento.numeroSerie,
      },
      acao: item.acao,
      dataAcao: item.dataAcao.toISOString(),
    }));

    return res.status(200).json(formattedHistorico);
  } catch (error) {
    console.error('Erro detalhado ao buscar histórico:', error);
    return res.status(500).json({
      error: 'Erro ao buscar histórico',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}

// Nova função para exportar histórico como CSV
async function handleExportCsv(req, res) {
  try {
    const historico = await prisma.historico.findMany({
      include: {
        funcionario: {
          select: {
            nome: true,
            matricula: true,
          },
        },
        equipamento: {
          select: {
            nome: true,
            numeroSerie: true,
          },
        },
      },
    });

    const formattedHistorico = historico.map((item) => ({
      funcionario: item.funcionario.nome,
      matricula: item.funcionario.matricula,
      equipamento: item.equipamento.nome,
      numeroSerie: item.equipamento.numeroSerie,
      acao: item.acao,
      dataAcao: item.dataAcao.toISOString(),
    }));

    const csv = new Parser().parse(formattedHistorico);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=historico.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Erro ao gerar CSV:', error);
    res.status(500).json({ error: 'Erro ao gerar CSV' });
  }
}
