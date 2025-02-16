import express from 'express'
import TecnicoController from '../controllers/TecnicoController.js'

const router = express.Router()

router.get('/', TecnicoController.tecnicosAtivos)

router.get('/cadastro', (req, res) => { res.render('tecnico/cadastro') })
router.post('/cadastro', TecnicoController.cadastrar)

router.get('/editar', TecnicoController.editar)
router.post('/editar', TecnicoController.salvar)

//rota admin
router.get('/editar/:id', TecnicoController.editar)
router.get('/excluir/:id', TecnicoController.excluir)

export default router