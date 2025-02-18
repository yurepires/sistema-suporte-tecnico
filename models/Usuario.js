import banco from "../config/banco.js";
import Pessoa from "./Pessoa.js";

const Usuario = banco.sequelize.define('usuarios', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: banco.Sequelize.STRING(100),
        unique: true
    },
    senha:{
        type: banco.Sequelize.STRING(150)
    },
    tipo:{
        type: banco.Sequelize.INTEGER
    },
    status:{
        type: banco.Sequelize.INTEGER
    }
})

Usuario.belongsTo(Pessoa, {
    foreignKey: 'pessoa_id',
    constraint: true,
    onDelete: 'CASCADE',
    as: 'pessoa'
})

// Usuario.sync()

export default Usuario