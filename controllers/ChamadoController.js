import { Op, where } from "sequelize";
import Atendimento from "../models/Atendimento.js";
import Chamado from "../models/Chamado.js";
import Tecnico from "../models/Tecnico.js";
import Usuario from "../models/Usuario.js";

class ChamadoController {

    usuarioChamados = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para ver seus chamados')
            return res.redirect('/usuario/login')
        }

        const chamados = await Chamado.findAll({
            where:{
                cliente_id: req.user.id,
                [Op.or]:[
                    {status: 'Em andamento'},
                    {status: 'Pendente'},
                    {status: 'Concluído'}
                ]
            }
        })

        return res.render('chamados/meuschamados', {chamados: chamados})
    }

    formCadastro = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para abrir um chamado')
            return res.redirect('/usuario/login')
        }

        if(req.user.tipo === 2){
            req.flash('error_msg', 'Técnicos não podem abrir chamados')
            return res.redirect('/')
        }

        res.render('chamados/cadastro')
    }

    cadastrar = async (req, res) => {
        const usuario = await Usuario.findOne({
            where:{
                id: req.user.id
            }
        })

        const novoChamado = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            status: "Pendente",
            cliente_id: usuario.id
        }
        Chamado.create(novoChamado).then(() => {
            req.flash('success_msg', 'Chamado cadastrado com sucesso!')
            res.redirect('/')
        })
    }

    editar = async (req, res) => {
        const chamado = await Chamado.findByPk(req.params.id)

        if(!chamado){
            req.flash('error_msg', 'Chamado não encontrado.')
            return res.redirect('/chamados/meuschamados')
        }

        res.render('chamados/editar', {chamado: chamado})
    }

    salvar = async (req, res) => {
        Chamado.update({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
        },{where:{
                id: req.body.id
            }
        }).then(() => {
            res.redirect('/chamados/meuschamados')
        })
    }

    excluir = async (req, res) => {
        const atendimento = await Atendimento.findOne({
            where:{
                chamado_id: req.params.id
            }
        })

        console.log(req.params.id)

        if(atendimento){
            Atendimento.update({status: 'Cancelado'}, {
                where:{
                    id: atendimento.id
                }
            })
        }

        // atendimento.tecnico_id estava dando erro de nulo
        if(atendimento && atendimento.tecnico_id){
            const tecnico = await Tecnico.findByPk(atendimento.tecnico_id)
            Tecnico.update({disponibilidade: 'Disponível'},{
                where:{
                    id: tecnico.id
                }
            })
        }

        const chamado = await Chamado.findByPk(req.params.id)
        if(chamado.status !== 'Excluído'){
            Chamado.update({status: 'Excluído'}, {
                where:{
                    id: chamado.id
                }
            }).then(() => {
                req.flash('success_msg', 'Chamado excluído.')
                return res.redirect('/chamados/meuschamados')
            })
        }
    }
}

export default new ChamadoController()