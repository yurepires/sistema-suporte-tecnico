import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'

const router = express.Router()

router.get('/login', (req, res) => res.render('usuario/login'))

router.post('/login', UsuarioController.login)

router.get('/editar', UsuarioController.editar)
router.post('/editar', UsuarioController.salvar)

//admin
router.get('/excluir/:id', UsuarioController.excluir)

export default router