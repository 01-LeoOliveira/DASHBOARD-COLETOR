import { pool } from '../../../config/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { nome, numeroSerie } = req.body;
    await pool.query('UPDATE equipamentos SET nome = ? WHERE numeroSerie = ?', [nome, id]);
    res.status(200).json({ message: 'Equipamento atualizado com sucesso' });
  } else if (req.method === 'DELETE') {
    await pool.query('DELETE FROM equipamentos WHERE numeroSerie = ?', [id]);
    res.status(200).json({ message: 'Equipamento excluído com sucesso' });
  }
}
