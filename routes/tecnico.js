import express from 'express'
import TecnicoController from '../controllers/TecnicoController.js'
import { tecnicoLogado, adminLogado } from '../config/rules.js'

const router = express.Router()

router.get('/cadastro', adminLogado,(req, res) => { res.render('tecnico/cadastro') })
router.post('/cadastro', adminLogado, TecnicoController.cadastrar)

router.get('/editar', tecnicoLogado, TecnicoController.editar)
router.post('/editar', tecnicoLogado,TecnicoController.salvar)

//rota admin
router.get('/editar/:id', adminLogado, TecnicoController.editar)
router.get('/excluir/:id', adminLogado, TecnicoController.excluir)

export default router