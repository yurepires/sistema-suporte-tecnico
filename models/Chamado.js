import banco from "../config/banco.js";
import Usuario from "./Usuario.js";
import Tecnico from "./Tecnico.js";


const Chamado = banco.sequelize.define('chamados', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo:{
        type: banco.Sequelize.STRING(150)
    },
    descricao:{
        type: banco.Sequelize.STRING(300)
    },
    status:{
        type: banco.Sequelize.STRING(20)
    },
})

Chamado.belongsTo(Usuario, {
    foreignKey: 'cliente_id',
    constraint: true,
    as: 'cliente'
})

Chamado.belongsTo(Tecnico, {
    foreignKey: 'tecnico_id',
    constraint: true,
    as: 'tecnico'
})

// Chamado.sync()

export default Chamado