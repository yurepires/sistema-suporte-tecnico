import { Op } from "sequelize";
import Pessoa from "../models/Pessoa.js";
import Usuario from "../models/Usuario.js";
import Tecnico from "../models/Tecnico.js";
import Chamado from "../models/Chamado.js";
import Atendimento from "../models/Atendimento.js";
import Feedback from "../models/Feedback.js";

class AdminController {
    listarPessoas = async (req, res) => {

        const pessoas = await Pessoa.findAll()

        res.render('admin/pessoas', {pessoas: pessoas})
    }

    listarUsuarios = async (req, res) => {
        if(req.user !== undefined){
            if(req.user.tipo !== 1){
                req.flash('error_msg', 'Apenas administradores podem acessar esta página.')
                return res.redirect('/')
            }
        }

        const usuarios = await Usuario.findAll()

        res.render('admin/usuarios', {usuarios: usuarios})
    }

    listarChamados = async (req, res) => {

        const chamados = await Chamado.findAll({
            where:{
                status: {
                    [Op.ne]: 'Excluído' //not equals
                }
            }
        })

        const tecnicos = await Tecnico.findAll()

        const clientes = await Usuario.findAll()

        const infos = chamados.map(chamado => {
            return {
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                status: chamado.status,
                cliente: clientes.find(cliente => cliente.id === chamado.cliente_id)
            }
        })

        res.render('admin/chamados', {infos: infos})
    }

    listarTecnicos = async (req, res) => {
        const tecnicos = await Tecnico.findAll()

        res.render('admin/tecnicos', {tecnicos: tecnicos})
    }

    listarAtendimentos = async (req, res) => {
        const atendimentos = await Atendimento.findAll()
        
        res.render('admin/atendimentos', {atendimentos: atendimentos})
    }

    listarFeedbacks = async (req, res) => {
        const feedbacks = await Feedback.findAll()

        res.render('admin/feedbacks', {feedbacks: feedbacks})
    }
}

export default new AdminController()