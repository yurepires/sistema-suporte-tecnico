import { where } from "sequelize";
import Atendimento from "../models/Atendimento.js";
import Chamado from "../models/Chamado.js";
import Pessoa from "../models/Pessoa.js";
import Tecnico from "../models/Tecnico.js";

class ChamadoController {

    usuarioChamados = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para ver seus chamados')
            return res.redirect('/usuario/login')
        }

        const chamados = await Chamado.findAll({
            where:{
                cliente_id: req.user.id,
                status: 'Em andamento'
            }
        })

        return res.render('chamados/meuschamados', {chamados: chamados})
    }

    cadastrar = async (req, res) => {
        const pessoa = await Pessoa.findOne({
            where:{
                id: req.params.id
            }
        })

        const novoChamado = {
            descricao: req.body.descricao,
            status: "Pendente",
            cliente_id: pessoa.id
        }
        Chamado.create(novoChamado).then(() => {
            req.flash('success_msg', 'Chamado cadastrado com sucesso!')
            res.redirect('/chamados')
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
                status: 'Em andamento',
                chamado_id: req.params.id
            }
        })

        if(atendimento){
            Atendimento.update({status: 'Cancelado'}, {
                where:{
                    id: atendimento.id
                }
            })
        }

        if(atendimento.tecnico_id){
            const tecnico = await Tecnico.findByPk(atendimento.tecnico_id)
            Tecnico.update({disponibilidade: 'Disponível', qtdAtendimentos: tecnico.qtdAtendimentos - 1},{
                where:{
                    id: tecnico.id
                }
            })
        }

        const chamado = await Chamado.findByPk(atendimento.chamado_id)
        if(chamado.status === 'Em andamento'){
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