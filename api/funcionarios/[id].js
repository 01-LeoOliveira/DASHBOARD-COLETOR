import { pool } from '../../../config/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, cpf, setor, turno, matricula } = req.body;
    await pool.query('UPDATE funcionarios SET nome = ?, setor = ?, turno = ?, matricula = ? WHERE cpf = ?', [nome, setor, turno, matricula, id]);
    res.status(200).json({ message: 'Funcionario atualizado com sucesso' });
  } else if (req.method === 'DELETE') {
    await pool.query('DELETE FROM funcionarios WHERE cpf = ?', [id]);
    res.status(200).json({ message: 'Funcionario excluído com sucesso' });
  }
}
