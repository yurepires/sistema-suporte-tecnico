import express from 'express'
import AdminController from '../controllers/AdminController.js'

const router = express.Router()

router.get('/pessoas', AdminController.listarPessoas)

export default router