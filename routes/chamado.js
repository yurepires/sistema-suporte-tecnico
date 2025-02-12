import express from 'express'
import ChamadoController from '../controllers/ChamadoController.js'

const router = express.Router()

router.get('/', ChamadoController.index)

router.get('/cadastro', ChamadoController.cadastrar)

router.post('/cadastro', ChamadoController.salvar)

export default router