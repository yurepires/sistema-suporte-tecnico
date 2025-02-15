import express from 'express'
import FeedbackController from '../controllers/FeedbackController.js'

const router = express.Router()

router.get('/', FeedbackController.chamadosConcluidos)

router.post('/novo', FeedbackController.novoFeedback)

router.get('/meusfeedbacks', FeedbackController.meusFeedbacks)

router.get('/editar/:id', FeedbackController.editar)

router.post('/editar', FeedbackController.salvar)

router.get('/excluir/:id', FeedbackController.excluir)

export default router