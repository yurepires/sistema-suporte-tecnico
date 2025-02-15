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

        if(req.user.tipo === 2 || req.user.tipo === 1){
            req.flash('error_msg', 'Você precisa ser técnico para acessar esta página')
            res.redirect('/')
        }

        const tecnico = await Tecnico.findOne({
            where:{
                usuario_id: req.user.id
            }
        })

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
}

export default new TecnicoController()