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
    // Verifica se o funcionário já tem um equipamento associado
    const funcionarioAssociacao = await prisma.associacao.findFirst({
      where: { funcionarioMatricula },
    })
    if (funcionarioAssociacao) {
      return res.status(400).json({ error: 'Funcionário já possui um equipamento associado' })
    }

    // Verifica se o equipamento já está associado a outro funcionário
    const equipamentoAssociacao = await prisma.associacao.findFirst({
      where: { equipamentoNumeroSerie },
    })
    if (equipamentoAssociacao) {
      return res.status(400).json({ error: 'Equipamento já está associado a outro funcionário' })
    }

    // Cria a nova associação
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

// Nova função para obter equipamentos disponíveis
export async function getEquipamentosDisponiveis() {
  const associacoes = await prisma.associacao.findMany({
    select: { equipamentoNumeroSerie: true },
  })
  const equipamentosAssociados = associacoes.map(a => a.equipamentoNumeroSerie)
  
  return prisma.equipamento.findMany({
    where: {
      numeroSerie: { notIn: equipamentosAssociados },
    },
  })
}

// Nova função para obter funcionários sem equipamentos
export async function getFuncionariosSemEquipamentos() {
  const associacoes = await prisma.associacao.findMany({
    select: { funcionarioMatricula: true },
  })
  const funcionariosComEquipamento = associacoes.map(a => a.funcionarioMatricula)
  
  return prisma.funcionario.findMany({
    where: {
      matricula: { notIn: funcionariosComEquipamento },
    },
  })
}