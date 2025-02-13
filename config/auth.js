import passportLocal from "passport-local"
import Usuario from "../models/Usuario.js"
import bcrypt from 'bcrypt'

const localEstrategy = passportLocal.Strategy 

export default (passport) => {
    passport.use(new localEstrategy(
        {usernameField: 'email', passwordField: 'senha'}, (username, password, done) => {
            Usuario.findOne({
                where:{
                    email: username
                }
            }).then((usuario) => {
                if (!usuario) {
                    return done(null, false, {message: 'Usuário não encontrado.'})
                }
                const isMatch = bcrypt.compare(password, usuario.senha)

                if (!isMatch) {
                    return done(null, false, {message: 'Senha incorreta!'})
                }

                return done(null, usuario)
            })
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