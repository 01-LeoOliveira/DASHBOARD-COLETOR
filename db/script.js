const connection = require("./db.js");

function getUsuarios(callback) {
    connection.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            return callback(error, null); // Passar o erro no callback
        }
        callback(null, results); // Passar os resultados no callback
    });
}

getUsuarios((error, usuarios) => {
    if (error) {
        console.error("Erro ao buscar usuários:", error);
    } else {
        console.log(usuarios);
    }
});
