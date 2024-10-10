"use client";

import { useState, useEffect } from 'react';

type Funcionario = {
  nome: string;
  cpf: string;
  foto: string | null; // Foto como URL de string
  setor: string;
  turno: string;
  matricula: string;
};

type Equipamento = {
  nome: string;
  numeroSerie: string;
};

type Associacao = {
  nomeFuncionario: string;
  matriculaFuncionario: string;
  numeroSerieEquipamento: string;
  fotoFuncionario: string | null;
};

interface Props {
  funcionarios: Funcionario[];
  equipamentos: Equipamento[];
  onAssociar: (associacao: Associacao) => void;
  onRemoverAssociacao: (associacao: Associacao, matriculaInput: string) => void;
}

export default function AssociarEquipamento({
  funcionarios = [],
  equipamentos = [],
  onAssociar,
  onRemoverAssociacao,
}: Props) {
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [numeroSerieEquipamento, setNumeroSerieEquipamento] = useState('');
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [matriculaInput, setMatriculaInput] = useState('');

  useEffect(() => {
    // Recuperar dados do Local Storage (se existirem)
    const savedAssociacoes = localStorage.getItem('associacoes');
    if (savedAssociacoes) {
      setAssociacoes(JSON.parse(savedAssociacoes));
    }
  }, []);

  useEffect(() => {
    // Salvar dados no Local Storage sempre que mudarem
    localStorage.setItem('associacoes', JSON.stringify(associacoes));
  }, [associacoes]);

  const handleAssociar = () => {
    // Busca o funcionário selecionado com base no nome
    const funcionarioSelecionado = funcionarios.find(
      (f) => f.nome === nomeFuncionario
    );

    // Busca o equipamento selecionado com base no número de série
    const equipamentoSelecionado = equipamentos.find(
      (e) => e.numeroSerie === numeroSerieEquipamento
    );

    if (funcionarioSelecionado && equipamentoSelecionado) {
      // Verifica se a associação já existe
      const associacaoExistente = associacoes.find(
        (assoc) =>
          assoc.nomeFuncionario === nomeFuncionario &&
          assoc.numeroSerieEquipamento === numeroSerieEquipamento
      );

      // Verifica se o equipamento já está associado
      const equipamentoJaAssociado = associacoes.some(
        (assoc) => assoc.numeroSerieEquipamento === numeroSerieEquipamento
      );

      // Verifica se o funcionário já está associado
      const funcionarioJaAssociado = associacoes.some(
        (assoc) => assoc.nomeFuncionario === nomeFuncionario
      );

      if (!associacaoExistente && !equipamentoJaAssociado && !funcionarioJaAssociado) {
        const novaAssociacao: Associacao = {
          nomeFuncionario,
          matriculaFuncionario: funcionarioSelecionado.matricula,
          numeroSerieEquipamento,
          fotoFuncionario: funcionarioSelecionado.foto,
        };
        setAssociacoes([...associacoes, novaAssociacao]);
        onAssociar(novaAssociacao);
        setNomeFuncionario('');
        setNumeroSerieEquipamento('');
      } else {
        alert('O funcionário já está associado a um equipamento ou o equipamento já está associado.');
      }
    } else {
      alert('Funcionário ou Equipamento não encontrado.');
    }
  };

  const handleRemoverAssociacao = (associacao: Associacao) => {
    if (associacao.matriculaFuncionario === matriculaInput) {
      const novasAssociacoes = associacoes.filter(
        (assoc) =>
          assoc.nomeFuncionario !== associacao.nomeFuncionario ||
          assoc.numeroSerieEquipamento !== associacao.numeroSerieEquipamento
      );
      setAssociacoes(novasAssociacoes);
      onRemoverAssociacao(associacao, matriculaInput);
    } else {
      alert('Matrícula incorreta.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Associar Equipamento</h2>
      <div className="space-y-4">
        <div>
          <label className="block">Nome do Funcionário:</label>
          <select
            value={nomeFuncionario}
            onChange={(e) => setNomeFuncionario(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione o Funcionário</option>
            {funcionarios.map((funcionario, index) => (
              <option key={index} value={funcionario.nome}>
                {funcionario.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Número de Série do Equipamento:</label>
          <select
            value={numeroSerieEquipamento}
            onChange={(e) => setNumeroSerieEquipamento(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione o Equipamento</option>
            {equipamentos.map((equipamento, index) => (
              <option key={index} value={equipamento.numeroSerie}>
                {equipamento.numeroSerie}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAssociar} className="px-4 py-2 bg-green-700 text-white rounded">
          Associar
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Associações</h3>
        <ul>
          {associacoes.map((associacao, index) => (
            <li key={index} className="border p-2 mt-2 rounded flex items-center space-x-4">
              {associacao.fotoFuncionario && (
                <img
                  src={associacao.fotoFuncionario}
                  alt={associacao.nomeFuncionario}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <span>
                {associacao.nomeFuncionario} - {associacao.numeroSerieEquipamento}
              </span>
              <button
                onClick={() => handleRemoverAssociacao(associacao)}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Digite sua matrícula para remover associação"
          value={matriculaInput}
          onChange={(e) => setMatriculaInput(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
