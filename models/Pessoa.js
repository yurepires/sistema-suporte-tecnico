import banco from "../config/banco.js";

const Pessoa = banco.sequelize.define('pessoas', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: banco.Sequelize.STRING(100)
    },
    cpf:{
        type: banco.Sequelize.STRING(15),
        unique: true,
        allowNull: false
    },
    telefone:{
        type: banco.Sequelize.STRING(16)
    },
})

// Pessoa.sync()

export default Pessoa