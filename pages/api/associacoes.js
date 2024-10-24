import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

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
    console.error('Erro ao buscar associações:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar associações',
      details: error.message 
    })
  }
}

// POST /api/associacoes
async function handlePost(req, res) {
  const { funcionarioMatricula, equipamentoNumeroSerie } = req.body

  // Validação dos dados de entrada
  if (!funcionarioMatricula || !equipamentoNumeroSerie) {
    return res.status(400).json({ 
      error: 'Dados incompletos',
      message: 'Matrícula do funcionário e número de série do equipamento são obrigatórios' 
    })
  }

  try {
    // Verifica se o funcionário existe
    const funcionario = await prisma.funcionario.findUnique({
      where: { matricula: funcionarioMatricula }
    })
    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' })
    }

    // Verifica se o equipamento existe
    const equipamento = await prisma.equipamento.findUnique({
      where: { numeroSerie: equipamentoNumeroSerie }
    })
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' })
    }

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
        id: uuidv4(),
        funcionarioMatricula,
        equipamentoNumeroSerie,
        dataAssociacao: new Date(),
      },
      include: {
        funcionario: true,
        equipamento: true,
      },
    })

    // Registra a ação no histórico
    await prisma.historico.create({
      data: {
        funcionarioMatricula,
        equipamentoNumeroSerie,
        acao: 'Associado',
        dataAcao: new Date(),
      },
    })

    res.status(201).json(novaAssociacao)
  } catch (error) {
    console.error('Erro ao criar associação:', error)
    res.status(500).json({ 
      error: 'Erro ao criar associação',
      details: error.message 
    })
  }
}

// DELETE /api/associacoes
async function handleDelete(req, res) {
  const { matricula } = req.body

  if (!matricula) {
    return res.status(400).json({ 
      error: 'Dados incompletos',
      message: 'Matrícula do funcionário é obrigatória' 
    })
  }

  try {
    // Verifica se existem associações para esta matrícula
    const associacoesExistentes = await prisma.associacao.findMany({
      where: {
        funcionarioMatricula: matricula,
      },
      include: {
        equipamento: true,
      },
    })

    if (associacoesExistentes.length === 0) {
      return res.status(404).json({ 
        error: 'Nenhuma associação encontrada',
        message: 'Não foram encontradas associações para esta matrícula' 
      })
    }

    // Remove as associações encontradas
    await prisma.associacao.deleteMany({
      where: {
        funcionarioMatricula: matricula,
      },
    })

    // Registra a remoção no histórico para cada associação
    for (const associacao of associacoesExistentes) {
      await prisma.historico.create({
        data: {
          funcionarioMatricula: matricula,
          equipamentoNumeroSerie: associacao.equipamentoNumeroSerie,
          acao: 'Dissociado',
          dataAcao: new Date(),
        },
      })
    }

    res.status(200).json({ 
      message: 'Associações removidas com sucesso',
      removidas: associacoesExistentes.length 
    })
  } catch (error) {
    console.error('Erro ao remover associações:', error)
    res.status(500).json({ 
      error: 'Erro ao remover associações',
      details: error.message 
    })
  }
}

// Função auxiliar para obter equipamentos disponíveis
export async function getEquipamentosDisponiveis() {
  try {
    const associacoes = await prisma.associacao.findMany({
      select: { equipamentoNumeroSerie: true },
    })
    const equipamentosAssociados = associacoes.map(a => a.equipamentoNumeroSerie)
    
    return await prisma.equipamento.findMany({
      where: {
        numeroSerie: { notIn: equipamentosAssociados },
      },
    })
  } catch (error) {
    console.error('Erro ao buscar equipamentos disponíveis:', error)
    throw error
  }
}

// Função auxiliar para obter funcionários sem equipamentos
export async function getFuncionariosSemEquipamentos() {
  try {
    const associacoes = await prisma.associacao.findMany({
      select: { funcionarioMatricula: true },
    })
    const funcionariosComEquipamento = associacoes.map(a => a.funcionarioMatricula)
    
    return await prisma.funcionario.findMany({
      where: {
        matricula: { notIn: funcionariosComEquipamento },
      },
    })
  } catch (error) {
    console.error('Erro ao buscar funcionários sem equipamentos:', error)
    throw error
  }
}