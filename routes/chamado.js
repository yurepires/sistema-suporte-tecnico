import express from 'express'
import ChamadoController from '../controllers/ChamadoController.js'
import { usuarioLogado } from '../config/rules.js'

const router = express.Router()

router.get('/meuschamados', usuarioLogado, ChamadoController.usuarioChamados)

router.get('/cadastro', usuarioLogado, ChamadoController.formCadastro)

router.post('/cadastro', usuarioLogado, ChamadoController.cadastrar)

router.get('/editar/:id', usuarioLogado, ChamadoController.editar)

router.post('/editar', usuarioLogado, ChamadoController.salvar)

router.get('/excluir/:id', usuarioLogado, ChamadoController.excluir)

export default router