const Sequelize = require('sequelize');

//criando conexao com DB
const connection = new Sequelize("guiaperguntas", "root", "123456", {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;