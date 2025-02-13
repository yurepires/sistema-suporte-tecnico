import banco from "../config/banco.js";
import Chamado from "./Chamado.js";
import Tecnico from "./Tecnico.js";

const Atendimento = banco.sequelize.define('atendimentos', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    resumo:{
        type: banco.Sequelize.STRING(200)
    },
    status:{
        type: banco.Sequelize.STRING(20)
    },
})

Atendimento.belongsTo(Chamado, {
    foreignKey: 'chamado_id',
    constraint: true,
    onDelete: 'CASCADE',
    as: 'chamado'
})

Atendimento.belongsTo(Tecnico, {
    foreignKey: 'tecnico_id',
    constraint: true,
    as: 'tecnico'
})

// Atendimento.sync()

export default Atendimento