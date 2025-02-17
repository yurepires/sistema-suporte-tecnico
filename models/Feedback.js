import banco from "../config/banco.js";
import Atendimento from "./Atendimento.js";
import Tecnico from "./Tecnico.js";
import Usuario from "./Usuario.js";

const Feedback = banco.sequelize.define('feedbacks', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo:{
        type: banco.Sequelize.STRING(100)
    },
    descricao:{
        type: banco.Sequelize.STRING(300)
    },
    nota:{
        type: banco.Sequelize.FLOAT
    }
})

Feedback.belongsTo(Usuario, {
    foreignKey: 'cliente_id',
    constraint: true,
    as: 'usuario'
})

Feedback.belongsTo(Atendimento, {
    foreignKey: 'atendimento_id',
    constraint: true,
    onDelete: 'CASCADE',
    as: 'atendimento'
})

Feedback.belongsTo(Tecnico, {
    foreignKey: 'tecnico_id',
    constraint: true,
    onDelete: 'CASCADE',
    as: 'tecnico'
})

// Feedback.sync()

export default Feedback