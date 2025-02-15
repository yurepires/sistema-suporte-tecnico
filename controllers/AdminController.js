import Pessoa from "../models/Pessoa.js";

class AdminController {
    listarPessoas = async (req, res) => {

        if(req.user.tipo !== 1){
            req.flash('error_msg', 'Apenas administradores podem acessar esta página.')
            return res.redirect('/')
        }

        const pessoas = await Pessoa.findAll()

        res.render('admin/pessoas', {pessoas: pessoas})
    }

}

export default new AdminController()