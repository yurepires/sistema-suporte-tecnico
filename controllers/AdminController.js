import Pessoa from "../models/Pessoa.js";
import Usuario from "../models/Usuario.js";

class AdminController {
    listarPessoas = async (req, res) => {

        if(req.user !== undefined){
            if(req.user.tipo !== 1){
                req.flash('error_msg', 'Apenas administradores podem acessar esta página.')
                return res.redirect('/')
            }
        }

        const pessoas = await Pessoa.findAll()

        res.render('admin/pessoas', {pessoas: pessoas})
    }

    listarUsuarios = async (req, res) => {
        if(req.user !== undefined){
            if(req.user.tipo !== 1){
                req.flash('error_msg', 'Apenas administradores podem acessar esta página.')
                return res.redirect('/')
            }
        }

        const usuarios = await Usuario.findAll()

        res.render('admin/usuarios', {usuarios: usuarios})
    }

}

export default new AdminController()