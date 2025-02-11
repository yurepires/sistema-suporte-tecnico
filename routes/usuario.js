import express from 'express'
import UsuarioController from '../controllers/UsuarioController.js'

const router = express.Router()

router.get('/login', UsuarioController.formularioLogin)

router.post('/login', UsuarioController.login)

export default router