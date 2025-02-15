import passport from "passport";
import Usuario from "../models/Usuario.js";
import bcrypt from 'bcrypt'

class UsuarioController {

    login = async (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/usuario/login',
            failureFlash: true
        })(req, res, next)
    }

    editar = async (req, res) => {

        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para acessar esta página')
            return res.redirect('/usuario/login')
        }

        const usuario = await Usuario.findByPk(req.user.id)

        res.render('usuario/editar', {usuario: usuario})
    }

    salvar = async (req, res) => {
        
        if(req.body.novaSenha !== req.body.novaSenhaRepetida){
            req.flash('error_msg', 'As senhas digitadas não são iguais')
            return res.redirect('/usuario/editar')
        }

        const salt = await bcrypt.genSalt(10)
        const hashSenha = await bcrypt.hash(req.body.novaSenha, salt)

        console.log(req.body.id)

        Usuario.update({senha: hashSenha}, {
            where:{
                id: req.body.id
            }
        }).then(() => {
            req.flash('success_msg', 'Senha atualizada com sucesso!')
            return res.redirect('/')
        })
    }

    excluir = async (req, res) => {
        if(req.user === undefined){
            req.flash('error_msg', 'Faça login para excluir cadastro.')
            return res.redirect('/usuario/login')
        }

        if(req.params.id !== undefined){
            if(req.user.tipo === 1){
                Usuario.update({status: 0}, {
                    where:{
                        id: req.params.id
                    }
                }).then(() => {
                    req.flash('success_msg', 'Usuário excluído com sucesso!')
                    return res.redirect('/admin/usuarios')
                })
            } else {
                req.flash('error_msg', 'Apenas administradores podem deletar usuários.')
                return res.redirect('/')
            }
        }
    }
}

export default new UsuarioController()