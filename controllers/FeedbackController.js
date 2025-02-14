import { where } from "sequelize";
import Chamado from "../models/Chamado.js";
import Feedback from "../models/Feedback.js";
import Tecnico from "../models/Tecnico.js";

class FeedbackController {

    chamadosConcluidos = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para realizar um feedback')
            return res.redirect('/usuario/login')
        }

        const chamados = await Chamado.findAll({
            where:{
                status: 'Concluído',
                cliente_id: req.user.id
            }
        })

        const tecnicos = await Tecnico.findAll()

        const infos = chamados.map(chamado => {
            return {
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                tecnico: tecnicos.find(tecnico => tecnico.id === chamado.tecnico_id) || { nome: 'Não atribuído' }
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

        console.log(feedback)

        await Feedback.create(feedback)

        const tecnico = await Tecnico.findByPk(feedback.tecnico_id)
        console.log(feedback.tecnico_id)
        Tecnico.update({avaliacao: (tecnico.avaliacao + feedback.nota) / (tecnico.qtdAtendimentos === 0 ? 1 : 2)}, {
            where:{
                id: feedback.tecnico_id
            }
        })
        req.flash('success_msg', 'Atendimento avaliado com sucesso!')
        return res.redirect('/feedback/meusfeedbacks')
    }
}

export default new FeedbackController()