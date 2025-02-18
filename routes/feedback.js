import express from 'express'
import FeedbackController from '../controllers/FeedbackController.js'
import { usuarioLogado } from '../config/rules.js'

const router = express.Router()

router.get('/', usuarioLogado, FeedbackController.chamadosConcluidos)

router.post('/novo', usuarioLogado, FeedbackController.novoFeedback)

router.get('/meusfeedbacks', usuarioLogado, FeedbackController.meusFeedbacks)

router.get('/editar/:id', usuarioLogado, FeedbackController.editar)

router.post('/editar', usuarioLogado, FeedbackController.salvar)

router.get('/excluir/:id', usuarioLogado, FeedbackController.excluir)

export default router