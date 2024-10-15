import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
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
        orderBy: {
          dataAcao: 'desc',
        },
      })

      const formattedHistorico = historico.map(item => ({
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
      }))

      res.status(200).json(formattedHistorico)
    } catch (error) {
      console.error('Erro detalhado ao buscar histórico:', error)
      res.status(500).json({ error: 'Erro ao buscar histórico', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}