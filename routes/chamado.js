import express from 'express'
import ChamadoController from '../controllers/ChamadoController.js'

const router = express.Router()

router.get('/meuschamados', ChamadoController.usuarioChamados)

router.get('/cadastro', ChamadoController.formCadastro)

router.post('/cadastro', ChamadoController.cadastrar)

router.get('/editar/:id', ChamadoController.editar)

router.post('/editar', ChamadoController.salvar)

router.get('/excluir/:id', ChamadoController.excluir)

export default router