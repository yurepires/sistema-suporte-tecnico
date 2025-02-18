import express from 'express'
import AtendimentoController from '../controllers/AtendimentoController.js'
import { tecnicoLogado, adminLogado } from '../config/rules.js'

const router = express.Router()

router.get('/', tecnicoLogado, AtendimentoController.chamadosPendentes)
router.post('/cadastro', tecnicoLogado, AtendimentoController.cadastrar)

router.get('/em-andamento', tecnicoLogado, AtendimentoController.atendimentoEmAndamento)
router.post('/concluir', tecnicoLogado, AtendimentoController.concluir)

router.get('/concluidos', tecnicoLogado, AtendimentoController.atendimentosConcluidos)

router.get('/editar/:id', tecnicoLogado, AtendimentoController.editar)
router.post('/editar', tecnicoLogado, AtendimentoController.salvar)

router.get('/cancelar/:id', tecnicoLogado, AtendimentoController.cancelar)

export default router