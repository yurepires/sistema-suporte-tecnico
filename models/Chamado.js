import banco from "../config/banco.js";
import Usuario from "./Pessoa.js";

const Chamado = banco.sequelize.define('chamados', {
    id:{
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descricao:{
        type: banco.Sequelize.STRING(150),
    },
    status:{
        type: banco.Sequelize.STRING(20)
    }
})

Chamado.belongsTo(Usuario, {
    foreignKey: 'cliente_id',
    constraint: true,
    as: 'cliente'
})

Chamado.belongsTo(Usuario, {
    foreignKey: 'tecnico_id',
    constraint: true,
    as: 'tecnico'
})

// Chamado.sync()

export default Chamado