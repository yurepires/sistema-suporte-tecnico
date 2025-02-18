import express from 'express'
import AdminController from '../controllers/AdminController.js'
import { adminLogado } from '../config/rules.js'

const router = express.Router()

router.get('/pessoas', adminLogado, AdminController.listarPessoas)

router.get('/usuarios', adminLogado, AdminController.listarUsuarios)

router.get('/chamados', adminLogado, AdminController.listarChamados)

router.get('/tecnicos', adminLogado, AdminController.listarTecnicos)

router.get('/atendimentos', adminLogado, AdminController.listarAtendimentos)

router.get('/feedbacks', adminLogado, AdminController.listarFeedbacks)

export default router