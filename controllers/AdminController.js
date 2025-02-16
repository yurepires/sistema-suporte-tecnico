import { Op } from "sequelize";
import Pessoa from "../models/Pessoa.js";
import Usuario from "../models/Usuario.js";
import Tecnico from "../models/Tecnico.js";
import Chamado from "../models/Chamado.js";

class AdminController {
    listarPessoas = async (req, res) => {

        if(req.user !== undefined){
            if(req.user.tipo !== 1){
                req.flash('error_msg', 'Apenas administradores podem acessar esta página.')
                return res.redirect('/')
            }
        }

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
        if(req.user !== undefined){
            if(req.user.tipo !== 1){
                req.flash('error_msg', 'Apenas administradores podem acessar esta página.')
                return res.redirect('/')
            }
        }

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
                cliente: clientes.find(cliente => cliente.id === chamado.cliente_id),
                tecnico: tecnicos.find(tecnico => tecnico.id === chamado.tecnico_id)
            }
        })

        res.render('admin/chamados', {infos: infos})
    }

    listarTecnicos = async (req, res) => {
        const tecnicos = await Tecnico.findAll()

        res.render('admin/tecnicos', {tecnicos: tecnicos})
    }
}

export default new AdminController()