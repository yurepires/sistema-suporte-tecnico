function logado(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error_msg', 'Faça login para acessar esta página')
    res.redirect('/usuario/login')
}

function usuarioLogado(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.tipo === 0 || req.user.tipo === 1){
            return next()
        } else {
            req.flash('error_msg', 'Apenas clientes ou admins podem acessar esta página.')
            return res.redirect('/')
        }
    }
    req.flash('error_msg', 'Faça login primeiro.')
    res.redirect('/usuario/login')
}

function tecnicoLogado(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.tipo === 2 || req.user.tipo === 1){
            return next()
        } else {
            req.flash('error_msg', 'Apenas tecnicos ou admins podem acessar esta página.')
            return res.redirect('/')
        }
    }
    req.flash('error_msg', 'Faça login primeiro.')
    return res.redirect('/usuario/login')
}

function adminLogado(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.tipo === 1){
            return next()
        } else {
            req.flash('error_msg', 'Apenas admins podem acessar esta página.')
            return res.redirect('/')
        }
    }
    req.flash('error_msg', 'Faça login primeiro.')
    return res.redirect('/usuario/login')
}

export {logado, adminLogado, tecnicoLogado, usuarioLogado}