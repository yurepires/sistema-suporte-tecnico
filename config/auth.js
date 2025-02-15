import passportLocal from "passport-local"
import Usuario from "../models/Usuario.js"
import bcrypt from 'bcrypt'

const localEstrategy = passportLocal.Strategy 

export default (passport) => {
    passport.use(new localEstrategy(
        {usernameField: 'email', passwordField: 'senha'}, async (username, password, done) => {
            const usuario = await Usuario.findOne({
                where:{
                    email: username
                }
            })

            if (!usuario) {
                return done(null, false, {message: 'Usuário não encontrado.'})
            }
            const isMatch = await bcrypt.compare(password, usuario.senha)

            if (!isMatch) {
                return done(null, false, {message: 'Senha incorreta!'})
            }

            return done(null, usuario)
        }
    ))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findByPk(id).then((usuario) => {
            done(null, usuario)
        })
    })
}