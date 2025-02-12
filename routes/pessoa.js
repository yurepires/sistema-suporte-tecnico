import express from 'express'
import PessoaController from '../controllers/PessoaController.js'

const router = express.Router()

router.get('/', PessoaController.index)

router.get('/cadastro', PessoaController.formularioCadastro)

router.post('/cadastro', PessoaController.cadastrar)


export default router