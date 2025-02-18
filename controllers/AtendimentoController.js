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

        res.render('atendimentos/index', {chamados: chamados})
    }

    cadastrar = async (req, res) => {
        
        const tecnico = await Tecnico.findOne({
            where:{
                usuario_id: req.user.id
            }
        })

        if(tecnico.disponibilidade === 'Ocupado'){
            req.flash('error_msg', 'Você já está fazendo um atendimento!')
            return res.redirect('/atendimentos')
        }

        const chamado = await Chamado.findByPk(req.body.chamado_id)

        if(!chamado){
            req.flash('error_msg', 'Chamado não encontrado.')
            return res.redirect('/atendimentos')
        }

        if(chamado.status === 'Em andamento'){
            req.flash('error_msg', 'Este chamado já está em andamento.')
            return res.redirect('/atendimentos')
        }

        const novoAtendimento = {
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

            Chamado.update({status: 'Em andamento'}, {
                where:{
                    id: novoAtendimento.chamado_id,
                }
            })
            req.flash('success_msg', 'Atendimento iniciado com sucesso!')
            return res.redirect('/atendimentos/em-andamento')
        })
    }

    atendimentoEmAndamento = async (req, res) => {

        const tecnico = await Tecnico.findOne({
            where:{
                usuario_id: req.user.id
            }
        })

        let atendimento = await Atendimento.findOne({
            where:{
                status: "Em andamento",
                tecnico_id: tecnico.id
            }
        })

        if(atendimento === null){
            req.flash('error_msg', 'Você não tem atendimentos em andamento.')
            return res.redirect('/atendimentos')
        }

        const chamado = await Chamado.findByPk(atendimento.chamado_id)

        const infos = {
            id: atendimento.id,
            titulo: chamado.titulo,
            descricao: chamado.descricao
        }

        //ache uma forma de mandar o atendimento com dados do chamado para a view

        res.render('atendimentos/emAndamento', {infos: infos})
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
            return res.redirect('/atendimentos/concluidos')
        })
    }

    atendimentosConcluidos = async (req, res) => {

        const tecnico = await Tecnico.findOne({
            where:{
                usuario_id: req.user.id
            }
        })

        const atendimentos = await Atendimento.findAll({
            where:{
                status: 'Concluído',
                tecnico_id: tecnico.id
            }
        })

        res.render('atendimentos/concluidos', {atendimentos: atendimentos})
    }

    editar = async (req, res) => {

        if(req.user.tipo !== 2){
            req.flash('error_msg', 'Apenas técnicos podem editar atendimentos.')
            return res.redirect('/')
        }

        const atendimento = await Atendimento.findByPk(req.params.id)

        res.render('atendimentos/editar', {atendimento: atendimento})
    }

    salvar = async (req, res) => {
        Atendimento.update({resumo: req.body.resumo}, {
            where:{
                id: req.body.id
            }
        }).then(() => {
            req.flash('success_msg', 'Atendimento editado com sucesso.')
            if(req.user.tipo === 1){
                return res.redirect('/admin/atendimentos')
            }
            res.redirect('/atendimentos/concluidos')
        })
    }

    cancelar = async (req, res) => {

        const atendimento = await Atendimento.findByPk(req.params.id)

        if(!atendimento){
            req.flash('error_msg', 'Atendimento não encontrado!')
            return res.redirect('/atendimentos/pendentes')
        }

        Tecnico.update({disponibilidade: 'Disponível'}, {
            where:{
                id: atendimento.tecnico_id
            }
        })

        Chamado.update({status: 'Pendente'}, {
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
            return res.redirect('/atendimentos')
        })
    }
}

export default new AtendimentoController()