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
        const atendimento = await Atendimento.findOne({
            where:{
                status: "Em andamento"
            }
        })
        res.render('atendimentos/cadastro', {chamados: chamados, atendimento: atendimento})
    }

    cadastrar = async (req, res) => {
        
        const tecnico = await Tecnico.findOne({
            where:{
                usuario_id: req.user.id
            }
        })

        if(tecnico.disponibilidade === 'Ocupado'){
            req.flash('error_msg', 'Você já está fazendo um atendimento!')
            return res.redirect('/atendimentos/pendentes')
        }

        const chamado = await Chamado.findByPk(req.body.chamado_id)

        if(!chamado){
            req.flash('error_msg', 'Chamado não encontrado.')
            return res.redirect('/atendimentos/pendentes')
        }

        if(chamado.status === 'Em andamento'){
            req.flash('error_msg', 'Este chamado já está em andamento.')
            return res.redirect('/atendimentos/pendentes')
        }

        const novoAtendimento = {
            resumo: "",
            status: "Em andamento",
            chamado_id: chamado.id,
            tecnico_id: tecnico.id
        }

        await Atendimento.create(novoAtendimento).then((novoAtendimento) => {
            Tecnico.update(
                {disponibilidade: 'Ocupado'},{
                    where:{
                        id: tecnico.id
                    }
                }
            )

            Chamado.update(
                {status: 'Em andamento', tecnico_id: novoAtendimento.tecnico_id},{
                where:{
                    id: novoAtendimento.chamado_id,
                }
            })
            req.flash('success_msg', 'Atendimento iniciado com sucesso!')
            return res.redirect('/')
        })
    }

    concluir = async (req, res) => {

        const atendimento = await Atendimento.findByPk(req.body.id)

        Chamado.update({status: 'Concluído'},{
            where:{
                id: atendimento.chamado_id
            }
        })

        const tecnico = await Tecnico.findByPk(atendimento.tecnico_id)

        Tecnico.update({disponibilidade: 'Disponível', qtdAtendimentos: tecnico.qtdAtendimentos + 1}, {
            where:{
                id: atendimento.tecnico_id
            }
        })

        Atendimento.update({resumo: req.body.resumo, status: 'Concluído'},{
            where:{
                id: atendimento.id
            }
        }).then(() => {
            req.flash('success_msg', 'Atendimento concluido!')
            return res.redirect('/atendimentos/pendentes')
        })
    }

    cancelar = async (req, res) => {

        const atendimento = await Atendimento.findByPk(req.params.id)

        if(!atendimento){
            req.flash('error_msg', 'Atendimento não encontrado!')
            return res.redirect('/atendimentos/pendentes')
        }

        Chamado.update({tecnico_id: null}, {
            where:{
                id: atendimento.chamado_id
            }
        })

        Atendimento.update({status: 'Cancelado'}, {
            where:{
                id: req.params.id
            }
        }).then(() => {
            req.flash('success_msg', 'Atendimento cancelado.')
            return res.redirect('/atendimentos/pendentes')
        })
    }
}

export default new AtendimentoController()