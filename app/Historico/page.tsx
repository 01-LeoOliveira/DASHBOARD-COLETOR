'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Historico = {
  id: string;
  funcionario: {
    nome: string;
    matricula: string;
  };
  equipamento: {
    nome: string;
    numeroSerie: string;
  };
  acao: string;
  dataAcao: string;
};

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Historico[]>('/api/historico');
        setHistorico(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
        setError('Falha ao carregar o histórico. Por favor, tente novamente mais tarde.');
        setIsLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Histórico de Associações</h2>
      {historico.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {historico.map((h) => (
            <li key={h.id} className="py-4">
              <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <p className="font-medium text-lg mb-2">
                  {h.acao === 'atribuicao' ? 'Atribuição' : 'Remoção'} de Equipamento
                </p>
                <p>
                  <strong>Funcionário:</strong> {h.funcionario.nome} 
                  <span className="text-gray-600 ml-2">(Matrícula: {h.funcionario.matricula})</span>
                </p>
                <p>
                  <strong>Equipamento:</strong> {h.equipamento.nome} 
                  <span className="text-gray-600 ml-2">(Nº Série: {h.equipamento.numeroSerie})</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Data da Ação:</strong> {formatDate(h.dataAcao)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum histórico disponível.</p>
      )}
    </div>
  );
}