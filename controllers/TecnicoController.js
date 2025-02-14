import Tecnico from "../models/Tecnico.js";
import Usuario from "../models/Usuario.js";
import Pessoa from "../models/Pessoa.js";
import bcrypt from "bcrypt"

class TecnicoController {

    tecnicosAtivos = async (req, res) => {

        const tecnicos = await Tecnico.findAll({
            where:{
                status: 1
            }
        })
        
        res.render('tecnicos/index', {tecnicos: tecnicos})
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
                const novoTecnico = {
                    disponibilidade: 'Disponível',
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
}

export default new TecnicoController()