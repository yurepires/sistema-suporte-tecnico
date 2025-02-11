import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Handlebars from 'handlebars'
import handlebars from 'express-handlebars'
import bodyParser from 'body-parser'

const app = express()
const port = 8090

// CONFIGURAÇÃO DA PASTA ESTÁTICA
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'public')))

// CONFIGURAÇÃO DA VISÃO
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROTAS DO SISTEMA

app.get('/', (req, res) => {
    res.render('admin/index')
})

import pessoa from './routes/pessoa.js'
app.use('/pessoa', pessoa)

import usuario from './routes/usuario.js'
app.use('/usuario', usuario)

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:"+port)
})