exports.middlewareGlobal = (req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
}

exports.checkCsrfError = (err, req, res, next) => {
    if(err){
        return res.render('404')
    }
    next()
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}