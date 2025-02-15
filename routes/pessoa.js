import express from 'express'
import PessoaController from '../controllers/PessoaController.js'

const router = express.Router()

router.get('/', PessoaController.index)

router.get('/cadastro', (req, res) => {res.render('pessoa/cadastro')})
router.post('/cadastro', PessoaController.cadastrar)

router.get('/editar', PessoaController.editar)
router.post('/editar', PessoaController.salvar)

router.get('/excluir', PessoaController.excluir)

// rota para o admin
router.get('/excluir/:id', PessoaController.excluir)


export default router