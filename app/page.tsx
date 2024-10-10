"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch data from server
  useEffect(() => {
    axios.get('/api/funcionarios').then(response => {
      setFuncionarios(response.data);
    });

    axios.get('/api/equipamentos').then(response => {
      setEquipamentos(response.data);
    });
  }, []);

  // Handle submit for funcionario
  const handleFuncionarioSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const nome = form.nomeFuncionario.value;
    const setor = form.setorFuncionario.value;
    const turno = form.turnoFuncionario.value;
    const matricula = form.matriculaFuncionario.value;

    const novoFuncionario = { nome, setor, turno, matricula };

    if (editingFuncionarioIndex !== null) {
      const id = funcionarios[editingFuncionarioIndex].matricula;  // Assume matrícula is unique
      await axios.put(`/api/funcionarios/${id}`, novoFuncionario);
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios[editingFuncionarioIndex] = novoFuncionario;
      setFuncionarios(updatedFuncionarios);
      setEditingFuncionarioIndex(null);
    } else {
      const response = await axios.post('/api/funcionarios', novoFuncionario);
      setFuncionarios([...funcionarios, response.data]);
    }

    form.reset();
  };

  // Handle submit for equipamento
  const handleEquipamentoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const nome = form.nomeEquipamento.value;
    const numeroSerie = form.numeroSerieEquipamento.value;

    const novoEquipamento = { nome, numeroSerie };

    if (editingEquipamentoIndex !== null) {
      const id = equipamentos[editingEquipamentoIndex].numeroSerie;
      await axios.put(`/api/equipamentos/${id}`, novoEquipamento);
      const updatedEquipamentos = [...equipamentos];
      updatedEquipamentos[editingEquipamentoIndex] = novoEquipamento;
      setEquipamentos(updatedEquipamentos);
      setEditingEquipamentoIndex(null);
    } else {
      const response = await axios.post('/api/equipamentos', novoEquipamento);
      setEquipamentos([...equipamentos, response.data]);
    }

    form.reset();
  };

  const handleFuncionarioEdit = (index: number) => {
    setEditingFuncionarioIndex(index);
    const funcionario = funcionarios[index];
    const form = document.forms[0];
    form.nomeFuncionario.value = funcionario.nome;
    form.setorFuncionario.value = funcionario.setor;
    form.turnoFuncionario.value = funcionario.turno;
    form.matriculaFuncionario.value = funcionario.matricula;
  };

  const handleEquipamentoEdit = (index: number) => {
    setEditingEquipamentoIndex(index);
    const equipamento = equipamentos[index];
    const form = document.forms[1];
    form.nomeEquipamento.value = equipamento.nome;
    form.numeroSerieEquipamento.value = equipamento.numeroSerie;
  };

  const handleFuncionarioDelete = async (index: number) => {
    const id = funcionarios[index].matricula;  // Assume matrícula is unique
    await axios.delete(`/api/funcionarios/${id}`);
    setFuncionarios(funcionarios.filter((_, i) => i !== index));
  };

  const handleEquipamentoDelete = async (index: number) => {
    const id = equipamentos[index].numeroSerie;
    await axios.delete(`/api/equipamentos/${id}`);
    setEquipamentos(equipamentos.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Administrador</h1>

      <div className="flex space-x-4 mb-6">
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
          <h2 className="text-xl font-semibold mb-4">Cadastro de Funcionários</h2>
          <form onSubmit={handleFuncionarioSubmit} className="space-y-4">
            <div>
              <label className="block">Nome Completo:</label>
              <input type="text" name="nomeFuncionario" className="w-full p-2 border rounded" required />
            </div>

            <div>
              <label className="block">Setor:</label>
              <select name="setorFuncionario" className="w-full p-2 border rounded">
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>

            <div>
              <label className="block">Turno:</label>
              <select name="turnoFuncionario" className="w-full p-2 border rounded">
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>

            <div>
              <label className="block">Matrícula:</label>
              <input type="text" name="matriculaFuncionario" className="w-full p-2 border rounded" required />
            </div>

            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">
              {editingFuncionarioIndex !== null ? 'Atualizar Funcionário' : 'Cadastrar Funcionário'}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Lista de Funcionários</h3>
            <ul>
              {funcionarios.map((funcionario, index) => (
                <li key={index} className="border p-2 mt-2 rounded">
                  {funcionario.nome} - {funcionario.setor} - {funcionario.turno} - {funcionario.matricula}
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'equipamentos' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Cadastro de Equipamentos</h2>
          <form onSubmit={handleEquipamentoSubmit} className="space-y-4">
            <div>
              <label className="block">Nome do Equipamento:</label>
              <input type="text" name="nomeEquipamento" className="w-full p-2 border rounded" required />
            </div>

            <div>
              <label className="block">Número de Série:</label>
              <input type="text" name="numeroSerieEquipamento" className="w-full p-2 border rounded" required />
            </div>

            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">
              {editingEquipamentoIndex !== null ? 'Atualizar Equipamento' : 'Cadastrar Equipamento'}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Lista de Equipamentos</h3>
            <ul>
              {equipamentos.map((equipamento, index) => (
                <li key={index} className="border p-2 mt-2 rounded">
                  {equipamento.nome} - {equipamento.numeroSerie}
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
