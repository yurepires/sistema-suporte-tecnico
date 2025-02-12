import Chamado from "../models/Chamado.js";
import Pessoa from "../models/Pessoa.js";

class ChamadoController {
    index = async (req, res) => {
        const chamados = await Chamado.findAll({
            where:{
                cliente_id: req.params.id
            }
        })
        res.render('chamados/index', {chamados: chamados})
    }

    cadastrar = (req, res) => {
        res.render('chamados/cadastro')
    }

    salvar = async (req, res) => {
        const pessoa = await Pessoa.findOne({
            where:{
                id: req.params.id
            }
        })

        const novoChamado = {
            descricao: req.body.descricao,
            status: "Em espera",
            cliente_id: pessoa.id
        }
        Chamado.create(novoChamado).then(() => {
            req.flash('success_msg', 'Chamado cadastrado com sucesso!')
            res.redirect('/chamados')
        })
    }
}

export default new ChamadoController()