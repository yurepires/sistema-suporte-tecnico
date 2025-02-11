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
            return res.redirect('/pessoa/cadastro')
        }

        const isMatch = await bcrypt.compare(req.body.senha, usuario.senha)

        if (!isMatch) {
            return res.redirect('/pessoa/cadastro')
        }

        res.redirect('/')
    }
}

export default new UsuarioController()