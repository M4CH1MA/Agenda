const mongoose = require('mongoose')
const validator = require('validator')

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

    async register(){
        this.valida()
        //Checa se nao tem nenhum erro no array error
        if(this.error.length > 0){
            return
        }
        try{
            this.user = await LoginModel.create(this.body)
        }catch(e){
            console.log(e)
        }
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
