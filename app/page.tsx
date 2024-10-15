"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from 'next/image';

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
      {/* Logo da empresa */}
      <div className="mt-8 mb-4">
        <Image
          src="/image/GrupoSC.png"  // Substitua pela URL real da sua logo
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
              <h3 className="text-lg font-semibold text-center">Lista de Funcionários</h3>
              <ul>
                {funcionarios.map((funcionario, index) => (
                  <li key={index} className="border p-2 mt-2 rounded flex justify-between items-center">
                    <span>{funcionario.nome} - {funcionario.setor} - {funcionario.turno} - {funcionario.matricula}</span>
                    <div>
                      <button
                        onClick={() => handleFuncionarioEdit(index)}
                        className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleFuncionarioDelete(index)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                      >
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
              <h3 className="text-lg font-semibold text-center">Lista de Equipamentos</h3>
              <ul>
                {equipamentos.map((equipamento, index) => (
                  <li key={index} className="border p-2 mt-2 rounded flex justify-between items-center">
                    <span>{equipamento.nome} - {equipamento.numeroSerie}</span>
                    <div>
                      <button
                        onClick={() => handleEquipamentoEdit(index)}
                        className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEquipamentoDelete(index)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                      >
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
