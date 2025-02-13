import passport from "passport";
import Usuario from "../models/Usuario.js";

class UsuarioController {

    login = async (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/usuario/login',
            failureFlash: true
        })(req, res, next)
    }
}

export default new UsuarioController()