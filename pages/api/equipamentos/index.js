import pool from '../../../db/db'; // Ajuste se necessário


export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const equipamentos = await pool.query('SELECT * FROM equipamentos');
        res.status(200).json(equipamentos.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar equipamentos' });
      }
      break;

    case 'POST':
      const { nome, numeroSerie } = req.body; // Aqui está a definição do numeroSerie
      try {
        const newEquipamento = await pool.query(
          'INSERT INTO equipamentos (nome, numeroSerie) VALUES ($1, $2) RETURNING *',
          [nome, numeroSerie]
        );
        res.status(201).json(newEquipamento.rows[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar equipamento' });
      }
      break;

    case 'PUT':
      const { id, updateData } = req.body;
      try {
        const updatedEquipamento = await pool.query(
          'UPDATE equipamentos SET nome = $1 WHERE numeroSerie = $2 RETURNING *',
          [updateData.nome, id] // Aqui, você deve usar a variável que contém o id do equipamento
        );
        res.status(200).json(updatedEquipamento.rows[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar equipamento' });
      }
      break;

    case 'DELETE':
      const { numeroSerie: numeroSerieParaDeletar } = req.body; // Renomeando a variável para evitar conflito
      try {
        await pool.query('DELETE FROM equipamentos WHERE numeroSerie = $1', [numeroSerieParaDeletar]);
        res.status(204).end(); // No Content
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir equipamento' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
