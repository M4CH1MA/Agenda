const Contato = require('../models/ContatoModel')

exports.index = function(req, res){
    res.render('contato', {
        contato:{}
    })
}

exports.register = async (req, res) => {
    try{
        const contato = new Contato(req.body)
        await contato.register()
    
        if(contato.error.length > 0){
            req.flash('error', contato.error)
            req.session.save(() => res.redirect('/contato'))
            return
        }

        req.flash('success', 'Contato registrado com sucesso')
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))
        return
    }catch(e){
        console.log(e)
        return res.render('404')
    }
}

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404')
    const contato = await Contato.buscaPorId(req.params.id)

    if(!contato) return res.render('404')

    res.render('contato', {
        contato
    })
}