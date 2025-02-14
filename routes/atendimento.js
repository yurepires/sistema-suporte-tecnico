import express from 'express'
import AtendimentoController from '../controllers/AtendimentoController.js'

const router = express.Router()

router.get('/pendentes', AtendimentoController.chamadosPendentes)
router.post('/cadastro', AtendimentoController.cadastrar)

router.post('/concluir', AtendimentoController.concluir)

router.get('/cancelar/:id', AtendimentoController.cancelar)

export default router