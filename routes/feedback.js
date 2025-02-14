import express from 'express'
import FeedbackController from '../controllers/FeedbackController.js'

const router = express.Router()

router.get('/', FeedbackController.chamadosConcluidos)

router.post('/novo', FeedbackController.novoFeedback)

router.get('/meusfeedbacks', FeedbackController.meusFeedbacks)

export default router