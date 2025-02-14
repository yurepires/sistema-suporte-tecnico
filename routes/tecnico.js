import express from 'express'
import TecnicoController from '../controllers/TecnicoController.js'

const router = express.Router()

router.get('/', TecnicoController.tecnicosAtivos)

router.get('/cadastro', (req, res) => { res.render('tecnicos/cadastro') })
router.post('/cadastro', TecnicoController.cadastrar)

export default router