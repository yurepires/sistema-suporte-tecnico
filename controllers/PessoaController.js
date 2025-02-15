import Pessoa from "../models/Pessoa.js";
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
    
}

export default new PessoaController()