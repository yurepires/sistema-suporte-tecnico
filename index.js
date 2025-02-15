import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Handlebars from 'handlebars'
import handlebars from 'express-handlebars'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import bodyParser from 'body-parser'
import session from 'express-session'
import flash from 'connect-flash'
import passport from 'passport'
import auth from './config/auth.js'
auth(passport)

const app = express()
const port = 8090

// CONFIGURAÇÃO DA PASTA ESTÁTICA
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'public')))

// CONFIGURAÇÃO DA VISÃO
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// CONFIGURAÇÕES DE MENSAGENS
app.use(session({
    secret: '65bceeb8471a63c0cb6936ad17cbf204e0b9cdf1716c0ab1856abedb38101177',
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.usuario = req.user || null
    next()
})

// ROTAS DO SISTEMA

app.get('/', (req, res) => {
    res.render('admin/index')
})

import pessoa from './routes/pessoa.js'
app.use('/pessoa', pessoa)

import usuario from './routes/usuario.js'
app.use('/usuario', usuario)

import chamados from './routes/chamado.js'
app.use('/chamados', chamados)

import atendimentos from './routes/atendimento.js'
app.use('/atendimentos', atendimentos)

import tecnico from './routes/tecnico.js'
app.use('/tecnico', tecnico)

import feedback from './routes/feedback.js'
app.use('/feedback', feedback)

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:"+port)
})