import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// GET /api/associacoes
async function handleGet(req, res) {
  try {
    const associacoes = await prisma.associacao.findMany({
      include: {
        funcionario: true,
        equipamento: true,
      },
    })
    res.status(200).json(associacoes)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar associações' })
  }
}

// POST /api/associacoes
async function handlePost(req, res) {
  const { funcionarioMatricula, equipamentoNumeroSerie } = req.body
  try {
    const novaAssociacao = await prisma.associacao.create({
      data: {
        funcionarioMatricula,
        equipamentoNumeroSerie,
      },
      include: {
        funcionario: true,
        equipamento: true,
      },
    })
    res.status(201).json(novaAssociacao)
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar associação' })
  }
}

// DELETE /api/associacoes
async function handleDelete(req, res) {
  const { matricula } = req.body
  try {
    await prisma.associacao.deleteMany({
      where: {
        funcionarioMatricula: matricula,
      },
    })
    res.status(200).json({ message: 'Associações removidas com sucesso' })
  } catch (error) {
    res.status(400).json({ error: 'Erro ao remover associações' })
  }
}