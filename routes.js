const express = require('express')
const route = express.Router()
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')

const {loginRequired} = require('./src/middlewares/middleware')

//Rota home
route.get('/', homeController.index)

//Rota login
route.get('/login/', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

//Rotas para contatos
route.get('/contato/', loginRequired, contatoController.index)
route.post('/contato/register', contatoController.register)
route.get('/contato/index/:id', contatoController.editIndex)

module.exports = route