import banco from "../config/banco.js";
import Atendimento from "./Atendimento.js";
import Usuario from "./Usuario.js";


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

// Chamado.sync()

export default Chamado