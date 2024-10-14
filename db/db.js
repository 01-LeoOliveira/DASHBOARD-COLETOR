// Importando o pacote mysql
const mysql = require('mysql');
// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'controledecoletor'
});

// Conectando ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ' + err.stack);
    return;
  }
  console.log('Conexão bem-sucedida como ID ' + connection.threadId);
});

module.exports = connection;