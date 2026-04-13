const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'rpg_seguranca_digital'
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar no banco:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

module.exports = db;
