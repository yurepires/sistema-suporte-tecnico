import Usuario from "../models/Usuario.js";
import bcrypt from 'bcrypt'

class UsuarioController {
    formularioLogin = (req, res) => {
        res.render('usuario/login')
    }

    login = async (req, res) => {
        const usuario = await Usuario.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!usuario) {
            req.flash('error_msg', 'Email inexistente!')
            return res.redirect('/pessoa/cadastro')
        }

        const isMatch = await bcrypt.compare(req.body.senha, usuario.senha)

        if (!isMatch) {
            req.flash('error_msg', 'Senha incorreta!')
            return res.redirect('/usuario/login')
        }

        req.flash('success_msg', 'Login feito com sucesso!')
        res.redirect('/')
    }
}

export default new UsuarioController()