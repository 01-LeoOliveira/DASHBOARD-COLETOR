import pool from '../../../db/db'; // Ajuste se necessário

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { rows } = await pool.query('SELECT * FROM funcionarios');
        res.status(200).json(rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar funcionários' });
      }
      break;

    case 'POST':
      const { nome, setor, turno, matricula: postMatricula } = req.body; // Renomeie a variável aqui
      try {
        const newFuncionario = await pool.query(
          'INSERT INTO funcionarios (nome, setor, turno, matricula) VALUES ($1, $2, $3, $4) RETURNING *',
          [nome, setor, turno, postMatricula] // Use a nova variável
        );
        res.status(201).json(newFuncionario.rows[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
      }
      break;

    case 'PUT':
      const { id, updateData } = req.body;
      if (!updateData || !id) {
        return res.status(400).json({ error: 'Dados de atualização ou ID ausentes' });
      }
      try {
        const updatedFuncionario = await pool.query(
          'UPDATE funcionarios SET nome = $1, setor = $2, turno = $3 WHERE matricula = $4 RETURNING *',
          [updateData.nome, updateData.setor, updateData.turno, id]
        );

        if (updatedFuncionario.rows.length === 0) {
          return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        res.status(200).json(updatedFuncionario.rows[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar funcionário' });
      }
      break;

    case 'DELETE':
      const { matricula } = req.body; // Isso agora não vai conflitar
      try {
        const result = await pool.query('DELETE FROM funcionarios WHERE matricula = $1', [matricula]);

        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        res.status(204).end(); // No Content
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir funcionário' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
