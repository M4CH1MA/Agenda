const { async } = require('regenerator-runtime')
const Login = require('../models/LoginModel')

exports.index = (req, res) => {
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