import { Sequelize, where } from "sequelize";
import Pessoa from "../models/Pessoa.js";
import Tecnico from "../models/Tecnico.js";
import Usuario from "../models/Usuario.js";
import bcrypt from 'bcrypt'

class PessoaController{

    index = async (req, res) => {
        const pessoas = await Pessoa.findAll()
        res.render('pessoa/index', {pessoas: pessoas})
    }

    cadastrar = async (req, res) => {
        const pessoa = await Pessoa.findOne({
            where:{
                cpf: req.body.cpf
            }
        })

        if(pessoa){
            req.flash('error_msg', 'Cliente com esse CPF já está cadastrado!')
            return res.redirect('/pessoa/cadastro')
        }

        let novaPessoa = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            status: 1
        }
        await Pessoa.create(novaPessoa).then(async (novaPessoa) => {
            const salt = await bcrypt.genSalt(10)
            const hashSenha = await bcrypt.hash(req.body.senha, salt)

            const novoUsuario = {
                email: req.body.email,
                senha: hashSenha,
                tipo: 0,
                status: 1,
                pessoa_id: novaPessoa.id
            }
            Usuario.create(novoUsuario).then(() => {
                req.flash('success_msg', 'Cliente cadastrado com sucesso!')
                res.redirect('/usuario/login')
            }).catch((error) => {
                req.flash('error_msg', error.message)
            })
        })
    }

    editar = async (req, res) => {
        const usuario = await Usuario.findByPk(req.user.id)

        if(req.user === undefined){
            req.flash('error_msg', 'Você deve estar logado para editar seus dados')
            return res.redirect('/usuario/login')
        }

        const pessoa = await Pessoa.findByPk(usuario.pessoa_id)

        res.render('pessoa/editar', {pessoa: pessoa, usuario: usuario})
    }

    salvar = async (req, res) => {

        Pessoa.update({
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
        }, {
            where:{
                id: req.body.id
            }
        }).then(() => {
            req.flash('success_msg', 'Dados editados com sucesso!')
            res.redirect('/')
        })
    }

    excluir = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para excluir cadastro.')
            res.redirect('/usuario/login')
        }

        let usuario = {}
        // Verifica se foi passado params e que tipo de usuario passou
        if(req.params.id !== undefined){
            if(req.user.tipo === 1){
                let pessoa = await Pessoa.findByPk(req.params.id) // o id passado na pagina admin/pessoas é de pessoa
                usuario = await Usuario.findOne({
                    where:{
                        pessoa_id: pessoa.id
                    }
                })
            } else {
                req.flash('error_msg', 'Apenas administradores podem excluir outros cadastros!')
                return res.redirect('/')
            }
        } else {
            usuario = await Usuario.findByPk(req.user.id)
        }

        // Seta status 0 se for tecnico
        if(usuario.tipo === 2){
            Tecnico.update({status: 0}, {
                where:{
                    usuario_id: usuario.id
                }
            })
        }

        Usuario.update({status: 0}, {
            where:{
                id: usuario.id
            }
        })

        Pessoa.update({status: 0}, {
            where:{
                id: usuario.pessoa_id
            }
        }).then(() => {
            req.flash('success_msg', 'Cadastro excluído com sucesso.')
            if(req.user.tipo === 1){
                res.redirect('/admin/pessoas')
            } else {
                res.redirect('/usuario/login')
            }
        })
    }
}

export default new PessoaController()