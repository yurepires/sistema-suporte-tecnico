import express from 'express'
import PessoaController from '../controllers/PessoaController.js'
import { logado, adminLogado } from '../config/rules.js'

const router = express.Router()

router.get('/cadastro', (req, res) => {res.render('pessoa/cadastro')})
router.post('/cadastro', PessoaController.cadastrar)

router.get('/editar', logado, PessoaController.editar)
router.post('/editar', logado, PessoaController.salvar)

router.get('/excluir', logado, PessoaController.excluir)

// rota para o admin
router.get('/excluir/:id', adminLogado, PessoaController.excluir)
router.get('/editar/:id', adminLogado, PessoaController.editar)


export default router