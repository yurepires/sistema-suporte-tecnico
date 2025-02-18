import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'
import { logado, adminLogado } from '../config/rules.js'


const router = express.Router()

router.get('/login', (req, res) => res.render('usuario/login', {layout: 'login'}))

router.post('/login', UsuarioController.login)

router.get('/editar', logado, UsuarioController.editar)
router.post('/editar', logado, UsuarioController.salvar)

router.get('/logout', logado, UsuarioController.logout)

//admin
router.get('/excluir/:id', adminLogado, UsuarioController.excluir)

export default router