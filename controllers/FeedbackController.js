import { Op, Sequelize, where } from "sequelize";
import Chamado from "../models/Chamado.js";
import Feedback from "../models/Feedback.js";
import Tecnico from "../models/Tecnico.js";
import Atendimento from "../models/Atendimento.js";

class FeedbackController {

    chamadosConcluidos = async (req, res) => {
        
        // Pega todos os atendimentos que não tem feedback 
        const atendimentos = await Atendimento.findAll({
            where:{
                status: 'Concluído',
                id: {
                    [Op.notIn]: Sequelize.literal("(SELECT atendimento_id FROM feedbacks)")
                }
            }
        })

        const chamados = await Chamado.findAll({
            where:{
                status: 'Concluído',
                cliente_id: req.user.id,
            }
        })

        const tecnicos = await Tecnico.findAll()

        let infos = chamados.map(chamado => {
            if(chamado.cliente_id === req.user.id){
                return {
                    atendimento: atendimentos.find(atendimento => atendimento.chamado_id === chamado.id),
                    chamado: chamado,
                }
            }
        }).filter(info => info && info.atendimento)

        infos = infos.map(info => {
            return {
                id: info.atendimento.id,
                titulo: info.chamado.titulo,
                descricao: info.chamado.descricao,
                tecnico: tecnicos.find(tecnico => tecnico.id === info.atendimento.tecnico_id)
            }
        })

        res.render('feedback/index', {infos: infos})
    }

    meusFeedbacks = async (req, res) => {
        let feedbacks = await Feedback.findAll({
            where:{
                cliente_id: req.user.id
            }
        })

        const tecnicos = await Tecnico.findAll()

        feedbacks = feedbacks.map(feedback => {
            return {
                feedback: feedback,
                tecnico: tecnicos.find(tecnico => tecnico.id === feedback.tecnico_id)
            }
        })

        res.render('feedback/meusfeedbacks', {infos: feedbacks})
    }
    
    novoFeedback = async (req, res) => {

        const feedback = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            nota: req.body.nota,
            cliente_id: req.user.id,
            atendimento_id: req.body.atendimento_id,
            tecnico_id: req.body.tecnico_id
        }

        await Feedback.create(feedback)

        const tecnico = await Tecnico.findByPk(feedback.tecnico_id)
        
        Tecnico.update({avaliacao: (Number(tecnico.avaliacao) + Number(feedback.nota)) / Number((tecnico.qtdAtendimentos === 1 ? 1 : 2))}, {
            where:{
                id: feedback.tecnico_id
            }
        })
        req.flash('success_msg', 'Atendimento avaliado com sucesso!')
        return res.redirect('/feedback/meusfeedbacks')
    }

    editar = async (req, res) => {

        const feedback = await Feedback.findOne({
            where:{
                id: req.params.id
            }
        })

        res.render('feedback/editar', {feedback: feedback})
    }

    salvar = async (req, res) => {
        const feedback = await Feedback.findByPk(req.body.id)

        if(feedback.nota !== req.body.nota){
            const tecnico = await Tecnico.findByPk(feedback.tecnico_id)

            if(tecnico.qtdAtendimentos === 1){
                Tecnico.update({avaliacao: req.body.nota}, {
                    where:{
                        id: tecnico.id
                    }
                })
            } else {
                // remove a nota antiga e põe a nota nova
                let avaliacaoSemNota = tecnico.avaliacao * 2 - feedback.nota
                Tecnico.update({avaliacao: (avaliacaoSemNota + Number(req.body.nota)) / 2}, {
                    where:{
                        id: tecnico.id
                    }
                })
            }
        }

        Feedback.update({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            nota: req.body.nota
        }, {
            where:{
                id: req.body.id
            }
        }).then(() => {
            req.flash('success_msg', 'Feedback modificado com sucesso!')
            res.redirect('/feedback/meusfeedbacks')
        })
    }

    excluir = async (req, res) => {
        const feedback = await Feedback.findByPk(req.params.id)
        const tecnico = await Tecnico.findByPk(feedback.tecnico_id)

        // remove a nota do feedback da avaliacao do tecnico
        Tecnico.update({avaliacao: tecnico.avaliacao * 2 - feedback.nota}, {
            where:{
                id: tecnico.id
            }
        })

        Feedback.destroy({
            where:{
                id: feedback.id
            }
        })
        req.flash('sucess_msg', 'Feedback excluído!')
        if(req.user.tipo === 1){
            return res.redirect('/admin/feedbacks')
        }
        res.redirect('/feedback/meusfeedbacks')
    }
}

export default new FeedbackController()