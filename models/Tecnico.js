import banco from "../config/banco.js";
import Usuario from "./Usuario.js";

const Tecnico = banco.sequelize.define('tecnicos', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    disponibilidade:{
        type: banco.Sequelize.STRING(20)
    },
    avaliacao:{
        type: banco.Sequelize.FLOAT
    },
    qtdAtendimentos:{
        type: banco.Sequelize.INTEGER
    }
})

Tecnico.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    constraint: true,
    as: 'usuario'
})

// Tecnico.sync()

export default Tecnico