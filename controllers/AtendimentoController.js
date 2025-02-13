import { where } from "sequelize";
import Atendimento from "../models/Atendimento.js";
import Chamado from "../models/Chamado.js";
import Tecnico from "../models/Tecnico.js";

class AtendimentoController {

    chamadosPendentes = async (req, res) => {
        const chamados = await Chamado.findAll({
            where:{
                status: "Pendente"
            }
        })
        res.render('atendimentos/cadastro', {chamados: chamados})
    }

    cadastrar = async (req, res) => {
        
        const tecnico = await Tecnico.findOne({
            where:{
                usuario_id: req.user.id
            }
        })

        const chamado = await Chamado.findByPk(req.body.chamado_id)

        if(!chamado){
            req.flash('error_msg', 'Chamado não encontrado.')
            res.redirect('/atendimento/cadastro')
        }

        const novoAtendimento = {
            resumo: "",
            status: "Em andamento",
            chamado_id: chamado.id,
            tecnico_id: tecnico.id
        }

        await Atendimento.create(novoAtendimento).then((novoAtendimento) => {
            Chamado.update(
                {status: 'Em andamento', tecnico_id: novoAtendimento.tecnico_id},{
                where:{
                    id: novoAtendimento.chamado_id,
                },
            })
            req.flash('success_msg', 'Atendimento iniciado com sucesso!')
            res.redirect('/')
        })
    }
}

export default new AtendimentoController()