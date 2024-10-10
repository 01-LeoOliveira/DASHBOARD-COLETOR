const { Pool } = require('pg'); // Ou use o pacote apropriado para o seu banco de dados

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'controledecoletor',
  password: '',
  port: 3306, // ou a porta do seu banco de dados
});

module.exports = pool;
