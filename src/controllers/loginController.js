const { async } = require('regenerator-runtime')
const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    res.render('login')
}

exports.register = async (req, res) => {
    try{
        const login  = new Login(req.body)
        await login.register()
    
        if(login.error.length > 0){
            req.flash('error', login.error)
            req.session.save(function(){
                return res.redirect('/login')
            })
            return
        }

        req.flash('success', 'Contato cadastrado com sucesso')
        req.session.save(function(){
            return res.redirect('/login')
        })
    }catch(e){
        console.log(e)
        return res.render('404')
    }
    
}

exports.login = async (req, res) => {
    try{
        const login  = new Login(req.body)
        await login.login()
    
        if(login.error.length > 0){
            req.flash('error', login.error)
            req.session.save(function(){
                return res.redirect('/login')
            })
            return
        }

        req.flash('success', 'Usuario logado')
        req.session.user = login.user
        req.session.save(function(){
            return res.redirect('/login')
        })
    }catch(e){
        console.log(e)
        return res.render('404')
    }
    
}

exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/')
}