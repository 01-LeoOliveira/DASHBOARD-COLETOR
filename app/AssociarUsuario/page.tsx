"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

type Funcionario = {
  nome: string;
  matricula: string;
};

type Equipamento = {
  nome: string;
  numeroSerie: string;
};

type Associacao = {
  id: string;
  funcionarioMatricula: string;
  equipamentoNumeroSerie: string;
  dataAssociacao: string;
};

export default function AssociacaoEquipamento() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState<string>('');
  const [selectedEquipamento, setSelectedEquipamento] = useState<string>('');
  const [matriculaParaRemover, setMatriculaParaRemover] = useState<string>('');

  useEffect(() => {
    // Carregar funcionários, equipamentos e associações existentes
    axios.get('/api/funcionarios').then(response => setFuncionarios(response.data));
    axios.get('/api/equipamentos').then(response => setEquipamentos(response.data));
    axios.get('/api/associacoes').then(response => setAssociacoes(response.data));
  }, []);

  // Função para obter equipamentos disponíveis
  const getEquipamentosDisponiveis = () => {
    const equipamentosAssociados = associacoes.map(a => a.equipamentoNumeroSerie);
    return equipamentos.filter(e => !equipamentosAssociados.includes(e.numeroSerie));
  };

  // Função para verificar se um funcionário já tem um equipamento associado
  const funcionarioTemEquipamento = (matricula: string) => {
    return associacoes.some(a => a.funcionarioMatricula === matricula);
  };

  const handleAssociar = async () => {
    if (!selectedFuncionario || !selectedEquipamento) {
      alert('Por favor, selecione um funcionário e um equipamento.');
      return;
    }

    if (funcionarioTemEquipamento(selectedFuncionario)) {
      alert('Este funcionário já possui um equipamento associado.');
      return;
    }

    try {
      const response = await axios.post('/api/associacoes', {
        funcionarioMatricula: selectedFuncionario,
        equipamentoNumeroSerie: selectedEquipamento,
      });
      setAssociacoes([...associacoes, response.data]);
      setSelectedFuncionario('');
      setSelectedEquipamento('');
    } catch (error) {
      console.error('Erro ao associar equipamento:', error);
      alert('Erro ao associar equipamento. Por favor, tente novamente.');
    }
  };

  const handleRemover = async () => {
    if (!matriculaParaRemover) {
      alert('Por favor, insira a matrícula do funcionário.');
      return;
    }

    try {
      await axios.delete('/api/associacoes', { data: { matricula: matriculaParaRemover } });
      setAssociacoes(associacoes.filter(a => a.funcionarioMatricula !== matriculaParaRemover));
      setMatriculaParaRemover('');
    } catch (error) {
      console.error('Erro ao remover associação:', error);
      alert('Erro ao remover associação. Por favor, tente novamente.');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <Image
          src="/image/GrupoSC.png"  // Substitua pela URL real da sua logo
          alt="Logo da Empresa"
          width={200}
          height={100}
        />
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Associação de Equipamentos</h2>

      {/* Associar Equipamento */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h3 className="text-2xl font-semibold mb-4">Associar Equipamento</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <select
            value={selectedFuncionario}
            onChange={(e) => setSelectedFuncionario(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
          >
            <option value="">Funcionário</option>
            {funcionarios
              .filter(f => !funcionarioTemEquipamento(f.matricula))
              .map((f) => (
                <option key={f.matricula} value={f.matricula}>{f.nome}</option>
              ))
            }
          </select>
          <select
            value={selectedEquipamento}
            onChange={(e) => setSelectedEquipamento(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
          >
            <option value="">Selecione um equipamento</option>
            {getEquipamentosDisponiveis().map((e) => (
              <option key={e.numeroSerie} value={e.numeroSerie}>{e.nome} (Nº Série: {e.numeroSerie})</option>
            ))}
          </select>
          <button
            onClick={handleAssociar}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
          >
            Associar
          </button>
        </div>
      </div>

      {/* Remover Associação */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h3 className="text-2xl font-semibold mb-4">Remover Associação</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            value={matriculaParaRemover}
            onChange={(e) => setMatriculaParaRemover(e.target.value)}
            placeholder="Matrícula do funcionário"
            className="p-2 border border-gray-300 rounded-md w-full sm:w-2/3"
          />
          <button
            onClick={handleRemover}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          >
            Remover
          </button>
        </div>
      </div>

      {/* Lista de Associações Atuais */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-2xl font-semibold mb-4">Associações Atuais</h3>
        <ul className="divide-y divide-gray-200">
          {associacoes.map((a) => (
            <li key={a.id} className="py-4">
              <p>
                <strong>Funcionário:</strong> {funcionarios.find(f => f.matricula === a.funcionarioMatricula)?.nome} 
                (Matrícula: {a.funcionarioMatricula})
              </p>
              <p>
                <strong>Equipamento:</strong> {equipamentos.find(e => e.numeroSerie === a.equipamentoNumeroSerie)?.nome} 
                (Nº Série: {a.equipamentoNumeroSerie})
              </p>
              <p><strong>Data de Associação:</strong> {new Date(a.dataAssociacao).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}