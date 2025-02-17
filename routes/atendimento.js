import express from 'express'
import AtendimentoController from '../controllers/AtendimentoController.js'

const router = express.Router()

router.get('/', AtendimentoController.chamadosPendentes)
router.post('/cadastro', AtendimentoController.cadastrar)

router.get('/em-andamento', AtendimentoController.atendimentoEmAndamento)
router.post('/concluir', AtendimentoController.concluir)

router.get('/concluidos', AtendimentoController.atendimentosConcluidos)

router.get('/editar/:id', AtendimentoController.editar)
router.post('/editar', AtendimentoController.salvar)

router.get('/cancelar/:id', AtendimentoController.cancelar)

export default router