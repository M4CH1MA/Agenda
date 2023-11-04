require('dotenv').config()  //arquivo referente a senha do banco

const express = require('express')  //express
const app = express();
const mongoose = require('mongoose') 
mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    app.emit('pronto')
}).catch(e => console.log(e))
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const routes = require('./routes')  
const path = require('path') 
const helmet = require('helmet')
const csrf = require('csurf') 
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware')  //Middlewares
app.use(helmet())
app.use(express.urlencoded({extended:true})) //post
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))) 
const sessionOptions = session({
    secret:"qwerty",
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //7 dias
        httpOnly: true
    }
})
app.use(sessionOptions)
app.use(flash())
app.set('views', path.resolve(__dirname, 'src', 'views')) 
app.set('view engine', 'ejs') 
app.use(csrf())

app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)

app.use(routes)  

app.on('pronto',() => {
    app.listen(3000, () => {
        console.log("Servidor http://127.0.0.1:3000/")
    })
})
