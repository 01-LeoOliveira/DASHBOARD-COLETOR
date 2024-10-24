"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';

type Historico = {
  id: number;
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

const HistoricoPage = () => {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [filteredHistorico, setFilteredHistorico] = useState<Historico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [periodoFilter, setPeriodoFilter] = useState('todos');

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/historico');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar dados');
        }
        
        const data = await response.json();
        setHistorico(data);
        setFilteredHistorico(data);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
        setError('Falha ao carregar o histórico. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  useEffect(() => {
    let filtered = historico;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.funcionario.matricula.includes(searchTerm) ||
        item.equipamento.numeroSerie.includes(searchTerm)
      );
    }

    // Filtro de status atualizado para corresponder aos valores da API
    if (statusFilter !== 'todos') {
      const statusMap = {
        'retirada': 'Associado',
        'devolucao': 'Dissociado'
      };
      filtered = filtered.filter(item => 
        item.acao === statusMap[statusFilter as keyof typeof statusMap]
      );
    }

    // Filtro de período
    if (periodoFilter !== 'todos') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(periodoFilter) {
        case 'hoje':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'semana':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'mes':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.dataAcao) >= filterDate);
    }

    setFilteredHistorico(filtered);
  }, [searchTerm, statusFilter, periodoFilter, historico]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (acao: string) => {
    switch(acao) {
      case 'Associado':
        return <Badge variant="default" className="bg-blue-500">Retirada</Badge>;
      case 'Dissociado':
        return <Badge variant="default" className="bg-green-500">Devolução</Badge>;
      default:
        return <Badge variant="default" className="bg-gray-500">{acao}</Badge>;
    }
  };

  const handleExportCsv = async () => {
    const response = await fetch('/api/historico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'export' }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historico.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error('Erro ao exportar CSV');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-red-500 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Equipamentos</CardTitle>
          <button
            onClick={handleExportCsv}
            className="mt-4 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Exportar como CSV
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome, matrícula ou equipamento..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="retirada">Retiradas</SelectItem>
                  <SelectItem value="devolucao">Devoluções</SelectItem>
                </SelectContent>
              </Select>

              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todo período</SelectItem>
                  <SelectItem value="hoje">Últimas 24h</SelectItem>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredHistorico.length > 0 ? (
              <div className="space-y-4">
                {filteredHistorico.map((h) => (
                  <Card key={h.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(h.acao)}
                            <span className="font-medium">{h.funcionario.nome}</span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Matrícula: {h.funcionario.matricula}</p>
                            <p>Equipamento: {h.equipamento.nome}</p>
                            <p>Nº Série: {h.equipamento.numeroSerie}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(h.dataAcao)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum registro encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoPage;