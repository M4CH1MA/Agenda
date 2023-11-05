const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login{
    constructor(body){
        this.body = body
        this.error = []
        this.user = null
    }

    async login(){
        this.valida()
        if(this.error.length > 0) return
        this.user = await LoginModel.findOne({email:this.body.email})

        //Checa se o usuario existe antes de verificar a senha
        if(!this.user) {
            this.error.push('Usuario nao existe')
            return
        }
        //Verifica o hash da senha
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.error.push('Usuario ou senha errado')
            this.user = null
            return
        }
    }

    async register(){
        this.valida()
        //Checa se nao tem nenhum erro no array error
        if(this.error.length > 0){
            return
        }
        await this.userExits()
        if(this.error.length > 0) return
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        this.user = await LoginModel.create(this.body)
    }

    async userExits(){
        this.user = await LoginModel.findOne({email:this.body.email})

        if(this.user) this.error.push('Usuario ja existe')
        
    }

    valida(){
        this.cleanUp()
        //validacao de email e senha
        if(!validator.isEmail(this.body.email)){
            this.error.push('Email invalido')
        }
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.error.push('A senha precisa ter entre 3 a 50 caracteres')
        }

    }   

    cleanUp(){
        //Valida que os dados passados pelo formularios sao uma string
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }

        this.body = {
            //coloca o body so os campos necessarios email e senha sem o csrf
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login
