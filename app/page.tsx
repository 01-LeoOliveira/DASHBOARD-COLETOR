"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Funcionario = {
  nome: string;
  matricula: string;
};

type Equipamento = {
  nome: string;
  numeroSerie: string;
};

type Associacoes = {
  id: string;
  funcionarioMatricula: string;
  equipamentoNumeroSerie: string;
  dataAssociacao: string;
};

export default function AssociacoesEquipamento() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [associacoes, setAssociacoes] = useState<Associacoes[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState<string>('');
  const [selectedEquipamento, setSelectedEquipamento] = useState<string>('');
  const [matriculaParaRemover, setMatriculaParaRemover] = useState<string>('');
  const [searchTermFuncionario, setSearchTermFuncionario] = useState<string>('');
  const [searchTermEquipamento, setSearchTermEquipamento] = useState<string>('');
  const [showFuncionariosList, setShowFuncionariosList] = useState<boolean>(false);
  const [showEquipamentosList, setShowEquipamentosList] = useState<boolean>(false);
  const [selectedFuncionarioNome, setSelectedFuncionarioNome] = useState<string>('');
  const [selectedEquipamentoNome, setSelectedEquipamentoNome] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcResponse, equipResponse, assocResponse] = await Promise.all([
          axios.get('/api/funcionarios'),
          axios.get('/api/equipamentos'),
          axios.get('/api/associacoes')
        ]);
  
        setFuncionarios(funcResponse.data);
        setEquipamentos(equipResponse.data);
        setAssociacoes(assocResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, recarregue a página.');
      }
    };
  
    fetchData();
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

  // Função para filtrar funcionários baseado no termo de busca
  const getFuncionariosFiltrados = () => {
    if (!searchTermFuncionario) return [];
    
    return funcionarios
      .filter(f => !funcionarioTemEquipamento(f.matricula))
      .filter(f => 
        f.nome.toLowerCase().includes(searchTermFuncionario.toLowerCase()) ||
        f.matricula.includes(searchTermFuncionario)
      );
  };

  // Função para filtrar equipamentos baseado no termo de busca
  const getEquipamentosFiltrados = () => {
    if (!searchTermEquipamento) return [];
    
    const equipamentosDisponiveis = getEquipamentosDisponiveis();
    return equipamentosDisponiveis.filter(e => 
      e.nome.toLowerCase().includes(searchTermEquipamento.toLowerCase()) ||
      e.numeroSerie.toLowerCase().includes(searchTermEquipamento.toLowerCase())
    );
  };

  const handleFuncionarioSelect = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario.matricula);
    setSelectedFuncionarioNome(funcionario.nome);
    setSearchTermFuncionario(funcionario.nome);
    setShowFuncionariosList(false);
  };

  const handleEquipamentoSelect = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento.numeroSerie);
    setSelectedEquipamentoNome(equipamento.nome);
    setSearchTermEquipamento(equipamento.nome);
    setShowEquipamentosList(false);
  };

  const handleAssociar = async () => {
    if (!selectedFuncionario || !selectedEquipamento) {
      alert('Por favor, selecione um funcionário e um equipamento.');
      return;
    }
  
    try {
      const response = await axios.post('/api/associacoes', {
        funcionarioMatricula: selectedFuncionario,
        equipamentoNumeroSerie: selectedEquipamento,
      });
  
      // Atualizar a lista de associações
      setAssociacoes(prev => [...prev, response.data]);
      
      // Limpar os campos
      setSelectedFuncionario('');
      setSelectedEquipamento('');
      setSearchTermFuncionario('');
      setSearchTermEquipamento('');
      setSelectedFuncionarioNome('');
      setSelectedEquipamentoNome('');
      
      alert('Associação realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao associar equipamento:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Erro ao associar equipamento';
        alert(errorMessage);
      } else {
        alert('Erro ao associar equipamento. Por favor, tente novamente.');
      }
    }
  };
  const handleRemover = async () => {
    if (!matriculaParaRemover) {
      alert('Por favor, insira a matrícula do funcionário.');
      return;
    }
  
    try {
      // Verifica se existe uma associação para esta matrícula
      const associacaoExistente = associacoes.find(
        a => a.funcionarioMatricula === matriculaParaRemover
      );
  
      if (!associacaoExistente) {
        alert('Não foi encontrada nenhuma associação para esta matrícula.');
        return;
      }
  
      await axios.delete('/api/associacoes', {
        data: { matricula: matriculaParaRemover }
      });
  
      // Atualiza o estado removendo a associação
      setAssociacoes(associacoes.filter(
        a => a.funcionarioMatricula !== matriculaParaRemover
      ));
  
      // Limpa o campo após remoção bem-sucedida
      setMatriculaParaRemover('');
      alert('Associação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover associação:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Erro ao remover associação';
        alert(errorMessage);
      } else {
        alert('Erro ao remover associação. Por favor, tente novamente.');
      }
    }
  };
  const handleLoginClick = () => {
    router.push('/Admin');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto relative">
      {/* Botão de Login */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Login Administrador
        </button>
      </div>

      {/* Logo centralizada */}
      <div className="flex justify-center mb-6">
        <Image
          src="/image/GrupoSC.png"
          alt="Logo da Empresa"
          width={200}
          height={100}
        />
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center">Associação de Equipamentos</h2>

      {/* Associar Equipamento */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h3 className="text-2xl font-semibold mb-4">Associar Equipamento</h3>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Campo de busca de funcionário */}
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              value={searchTermFuncionario}
              onChange={(e) => {
                setSearchTermFuncionario(e.target.value);
                setShowFuncionariosList(true);
              }}
              onFocus={() => setShowFuncionariosList(true)}
              placeholder="Digite o nome do funcionário"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {showFuncionariosList && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {getFuncionariosFiltrados().map((f) => (
                  <div
                    key={f.matricula}
                    onClick={() => handleFuncionarioSelect(f)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {f.nome} (Matrícula: {f.matricula})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campo de busca de equipamento */}
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              value={searchTermEquipamento}
              onChange={(e) => {
                setSearchTermEquipamento(e.target.value);
                setShowEquipamentosList(true);
              }}
              onFocus={() => setShowEquipamentosList(true)}
              placeholder="Digite o nome do equipamento"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            {showEquipamentosList && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {getEquipamentosFiltrados().map((e) => (
                  <div
                    key={e.numeroSerie}
                    onClick={() => handleEquipamentoSelect(e)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {e.nome} (Nº Série: {e.numeroSerie})
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAssociar}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
          >
            Associar
          </button>
        </div>

        {/* Exibir seleções atuais */}
        <div className="mt-4 text-sm text-gray-600">
          {selectedFuncionarioNome && (
            <p>Funcionário selecionado: {selectedFuncionarioNome}</p>
          )}
          {selectedEquipamentoNome && (
            <p>Equipamento selecionado: {selectedEquipamentoNome}</p>
          )}
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

