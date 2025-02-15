import { Op, Sequelize, where } from "sequelize";
import Chamado from "../models/Chamado.js";
import Feedback from "../models/Feedback.js";
import Tecnico from "../models/Tecnico.js";

class FeedbackController {

    chamadosConcluidos = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para realizar um feedback')
            return res.redirect('/usuario/login')
        }

        // Pega todos os chamados que não tem feedback 
        const chamados = await Chamado.findAll({
            where:{
                status: 'Concluído',
                cliente_id: req.user.id,
                id: {
                    [Op.notIn]: Sequelize.literal("(SELECT chamado_id FROM feedbacks)")
                }
            }
        })

        const tecnicos = await Tecnico.findAll({
            where:{
                status: 1
            }
        })

        const infos = chamados.map(chamado => {
            return {
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                tecnico: tecnicos.find(tecnico => tecnico.id === chamado.tecnico_id) || { nome: 'Técnico não existe ou foi excluído.' }
            };
        });

        res.render('feedback/index', {infos: infos})
    }

    meusFeedbacks = async (req, res) => {
        const feedbacks = await Feedback.findAll({
            where:{
                cliente_id: req.user.id
            }
        })

        res.render('feedback/meusfeedbacks', {feedbacks: feedbacks})
    }
    
    novoFeedback = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para realizar um feedback')
            return res.redirect('/usuario/login')
        }

        const feedback = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            nota: req.body.nota,
            cliente_id: req.user.id,
            chamado_id: req.body.chamado_id,
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
        
        if(req.user === undefined){
            req.flash('error_msg', 'Você deve estar logado para editar seus feedbacks')
            return res.redirect('/usuario/login')
        }

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
        res.redirect('/feedback/meusfeedbacks')
    }
}

export default new FeedbackController()