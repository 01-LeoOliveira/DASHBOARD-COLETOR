"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Funcionario = {
  nome: string;
  setor: string;
  turno: string;
  matricula: string;
};

type Equipamento = {
  nome: string;
  numeroSerie: string;
};

export default function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'funcionarios' | 'equipamentos'>('funcionarios');
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [editingFuncionarioIndex, setEditingFuncionarioIndex] = useState<number | null>(null);
  const [editingEquipamentoIndex, setEditingEquipamentoIndex] = useState<number | null>(null);
  const [funcionarioForm, setFuncionarioForm] = useState<Funcionario>({
    nome: '',
    setor: 'recebimento',
    turno: 'Manhã',
    matricula: ''
  });
  const [equipamentoForm, setEquipamentoForm] = useState<Equipamento>({
    nome: '',
    numeroSerie: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermEquipamento, setSearchTermEquipamento] = useState("");

  useEffect(() => {
    axios.get('/api/funcionarios').then(response => {
      setFuncionarios(response.data);
    });

    axios.get('/api/equipamentos').then(response => {
      setEquipamentos(response.data);
    });
  }, []);

  const handleFuncionarioSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editingFuncionarioIndex !== null) {
      const id = funcionarios[editingFuncionarioIndex].matricula;
      try {
        await axios.put(`/api/funcionarios`, { id, updateData: funcionarioForm });
        const updatedFuncionarios = [...funcionarios];
        updatedFuncionarios[editingFuncionarioIndex] = funcionarioForm;
        setFuncionarios(updatedFuncionarios);
        setEditingFuncionarioIndex(null);
      } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
      }
    } else {
      try {
        const response = await axios.post('/api/funcionarios', funcionarioForm);
        setFuncionarios([...funcionarios, response.data]);
      } catch (error) {
        console.error('Erro ao criar funcionário:', error);
      }
    }

    setFuncionarioForm({
      nome: '',
      setor: 'recebimento',
      turno: 'Manhã',
      matricula: ''
    });
  };

  const handleEquipamentoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editingEquipamentoIndex !== null) {
      const id = equipamentos[editingEquipamentoIndex].numeroSerie;
      try {
        await axios.put(`/api/equipamentos`, { id, updateData: equipamentoForm });
        const updatedEquipamentos = [...equipamentos];
        updatedEquipamentos[editingEquipamentoIndex] = equipamentoForm;
        setEquipamentos(updatedEquipamentos);
        setEditingEquipamentoIndex(null);
      } catch (error) {
        console.error('Erro ao atualizar equipamento:', error);
      }
    } else {
      try {
        const response = await axios.post('/api/equipamentos', equipamentoForm);
        setEquipamentos([...equipamentos, response.data]);
      } catch (error) {
        console.error('Erro ao criar equipamento:', error);
      }
    }

    setEquipamentoForm({
      nome: '',
      numeroSerie: ''
    });
  };

  const handleFuncionarioEdit = (index: number) => {
    setEditingFuncionarioIndex(index);
    const funcionario = funcionarios[index];
    setFuncionarioForm(funcionario);
  };

  const handleEquipamentoEdit = (index: number) => {
    setEditingEquipamentoIndex(index);
    const equipamento = equipamentos[index];
    setEquipamentoForm(equipamento);
  };

  const handleFuncionarioDelete = async (index: number) => {
    const matriculaToDelete = funcionarios[index].matricula;
    try {
      await axios.delete('/api/funcionarios', { data: { matriculaToDelete } });
      setFuncionarios(funcionarios.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
    }
  };

  const handleEquipamentoDelete = async (index: number) => {
    const numeroSerieToDelete = equipamentos[index].numeroSerie;
    try {
      await axios.delete('/api/equipamentos', { data: { numeroSerieToDelete } });
      setEquipamentos(equipamentos.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Botão para ir à área do usuário */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => router.push('/AssociarUsuario')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Área do Usuário
        </button>
      </div>

      {/* Logo da empresa */}
      <div className="mt-8 mb-4">
        <Image
          src="/image/GrupoSC.png"
          alt="Logo da Empresa"
          width={200}
          height={100}
        />
      </div>

      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Administrador</h1>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'funcionarios' ? 'bg-green-700 text-white' : 'bg-gray-300'}`}
            onClick={() => setActiveTab('funcionarios')}
          >
            Cadastro de Funcionários
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'equipamentos' ? 'bg-green-700 text-white' : 'bg-gray-300'}`}
            onClick={() => setActiveTab('equipamentos')}
          >
            Cadastro de Equipamentos
          </button>
          <button
            onClick={() => router.push('/Historico')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Histórico
          </button>
        </div>

        {activeTab === 'funcionarios' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Cadastro de Funcionários</h2>
            <form onSubmit={handleFuncionarioSubmit} className="space-y-4">
              <div>
                <label className="block">Nome Completo:</label>
                <input
                  type="text"
                  value={funcionarioForm.nome}
                  onChange={(e) => setFuncionarioForm({ ...funcionarioForm, nome: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block">Setor:</label>
                <select
                  value={funcionarioForm.setor}
                  onChange={(e) => setFuncionarioForm({ ...funcionarioForm, setor: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="recebimento">Recebimento</option>
                  <option value="separação">Separação</option>
                  <option value="segregados">Segregados</option>
                  <option value="expedição">Expedição</option>
                  <option value="conferencia">Conferência</option>
                  <option value="armazenagem">Armazenagem</option>
                  <option value="reposição">Reposição</option>
                  <option value="devolução">Devolução</option>
                </select>
              </div>
              <div>
                <label className="block">Turno:</label>
                <select
                  value={funcionarioForm.turno}
                  onChange={(e) => setFuncionarioForm({ ...funcionarioForm, turno: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>

              <div>
                <label className="block">Matrícula:</label>
                <input
                  type="text"
                  value={funcionarioForm.matricula}
                  onChange={(e) => setFuncionarioForm({ ...funcionarioForm, matricula: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded w-full">
                {editingFuncionarioIndex !== null ? 'Atualizar Funcionário' : 'Cadastrar Funcionário'}
              </button>
            </form>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-center mb-4">Lista de Funcionários</h3>
              <input
                type="text"
                placeholder="Pesquisar Funcionário..."
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="space-y-2">
                {funcionarios.filter(funcionario => funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((funcionario, index) => (
                  <li key={index} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                    <div>
                      {funcionario.nome} - {funcionario.setor} - {funcionario.turno} - {funcionario.matricula}
                    </div>
                    <div>
                      <button onClick={() => handleFuncionarioEdit(index)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                        Editar
                      </button>
                      <button onClick={() => handleFuncionarioDelete(index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 ml-2">
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'equipamentos' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Cadastro de Equipamentos</h2>
            <form onSubmit={handleEquipamentoSubmit} className="space-y-4">
              <div>
                <label className="block">Nome do Equipamento:</label>
                <input
                  type="text"
                  value={equipamentoForm.nome}
                  onChange={(e) => setEquipamentoForm({ ...equipamentoForm, nome: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block">Número de Série:</label>
                <input
                  type="text"
                  value={equipamentoForm.numeroSerie}
                  onChange={(e) => setEquipamentoForm({ ...equipamentoForm, numeroSerie: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded w-full">
                {editingEquipamentoIndex !== null ? 'Atualizar Equipamento' : 'Cadastrar Equipamento'}
              </button>
            </form>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-center mb-4">Lista de Equipamentos</h3>
              <input
                type="text"
                placeholder="Pesquisar Equipamento..."
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => setSearchTermEquipamento(e.target.value)}
              />
              <ul className="space-y-2">
                {equipamentos.filter(equipamento => equipamento.nome.toLowerCase().includes(searchTermEquipamento.toLowerCase())).map((equipamento, index) => (
                  <li key={index} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                    <div>
                      {equipamento.nome} - {equipamento.numeroSerie}
                    </div>
                    <div>
                      <button onClick={() => handleEquipamentoEdit(index)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                        Editar
                      </button>
                      <button onClick={() => handleEquipamentoDelete(index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 ml-2">
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
