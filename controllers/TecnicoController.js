import Tecnico from "../models/Tecnico.js";
import Usuario from "../models/Usuario.js";
import Pessoa from "../models/Pessoa.js";
import bcrypt from "bcrypt"
import { where } from "sequelize";

class TecnicoController {

    tecnicosAtivos = async (req, res) => {

        const tecnicos = await Tecnico.findAll({
            where:{
                status: 1
            }
        })
        
        res.render('tecnico/index', {tecnicos: tecnicos})
    }

    cadastrar = async (req, res) => {
        const pessoa = await Pessoa.findOne({
            where:{
                cpf: req.body.cpf
            }
        })

        if(pessoa){
            req.flash('error_msg', 'Cliente com esse CPF já está cadastrado!')
            return res.redirect('/tecnico/cadastro')
        }

        const usuario = await Usuario.findOne({
            where:{
                email: req.body.email
            }
        })

        if(usuario){
            req.flash('error_msg', 'Usuario com esse email já está cadastrado!')
            return res.redirect('/tecnico/cadastro')
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
                tipo: 2,
                status: 1,
                pessoa_id: novaPessoa.id
            }

            Usuario.create(novoUsuario).then((novoUsuario) => {
                // Pega o primeiro e último nome
                let nomes = novaPessoa.nome.split(" ")
                let nomeSobrenome = nomes[0]
                if(nomes.length > 1){
                    nomeSobrenome += " " + nomes[nomes.length - 1]
                }

                const novoTecnico = {
                    disponibilidade: 'Disponível',
                    nome: nomeSobrenome,
                    avaliacao: 0.0,
                    qtdAtendimentos: 0,
                    status: 1,
                    usuario_id: novoUsuario.id
                }

                Tecnico.create(novoTecnico).then(() => {
                    req.flash('success_msg', 'Técnico cadastrado com sucesso!')
                    res.redirect('/usuario/login')
                })
            })            
        })
    }

    editar = async (req, res) => {
        
        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para editar dados')
            res.redirect('/usuario/login')
        }

        if(req.user.tipo === 0){
            req.flash('error_msg', 'Você precisa ser técnico ou admin para acessar esta página')
            res.redirect('/')
        }

        let tecnico = {}
        if(req.params.id !== undefined){
            if(req.user.tipo === 1){
                tecnico = await Tecnico.findByPk(req.params.id)
                return res.render('tecnico/editar', {tecnico: tecnico})
            } else {
                req.flash('error_msg', 'Apenas administradores podem editar outros técnicos!')
                return res.redirect('/')
            }
        } else {
            tecnico = await Tecnico.findOne({
                where:{
                    usuario_id: req.user.id
                }
            })
        }

        res.render('tecnico/editar', {tecnico: tecnico})
    }

    salvar = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para editar dados')
            res.redirect('/usuario/login')
        }

        Tecnico.update({nome: req.body.nome}, {
            where:{
                usuario_id: req.user.id
            }
        }).then(() => {
            req.flash('success_msg', 'Técnico editado com sucesso.')
            res.redirect('/')
        })
    }

    excluir = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para excluir um funcionário!')
            return res.redirect('/usuario/login')
        }

        if(req.user.tipo !== 1){
            req.flash('error_msg', 'Apenas admins podem excluir outros funcionários.')
            return res.redirect('/')
        }

        const tecnico = await Tecnico.findByPk(req.params.id)

        const usuario = await Usuario.findByPk(tecnico.usuario_id)

        Tecnico.update({status: 0}, {
            where:{
                id: tecnico.id
            }
        })

        Usuario.update({status: 0}, {
            where:{
                id: usuario.id
            }
        })

        Pessoa.update({status: 0}, {
            where:{
                id: usuario.pessoa_id
            }
        })

        req.flash('success_msg', 'Funcionário excluído com sucesso!')
        res.redirect('/admin/tecnicos')
    }
}

export default new TecnicoController()