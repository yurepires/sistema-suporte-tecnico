import express from 'express'
import AdminController from '../controllers/AdminController.js'

const router = express.Router()

router.get('/pessoas', AdminController.listarPessoas)

router.get('/usuarios', AdminController.listarUsuarios)

router.get('/chamados', AdminController.listarChamados)

router.get('/tecnicos', AdminController.listarTecnicos)

router.get('/atendimentos', AdminController.listarAtendimentos)

export default router