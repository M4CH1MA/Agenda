const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default:''},
    email: {type: String, required: false, default:''},
    telefone: {type: String, required: false, default:''},
    criadoEm: {type: Date, default: Date.now},
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

//Pode ser feita com classe ou com constructor function
function Contato(body){
    this.body = body
    this.error = []
    this.user = null
}

Contato.buscaPorId = async function(id){
    if(typeof id !== 'string') return
    const user = await ContatoModel.findById(id)
    return user
}

Contato.prototype.register = async function(){
    this.valida();

    if(this.error.length > 0) return
    this.contato = await ContatoModel.create(this.body)
}

Contato.prototype.valida = function(){
    this.cleanUp()
    //validacao de email e senha
    if(this.body.email && !validator.isEmail(this.body.email)) this.error.push('Email invalido')
    if(!this.body.nome) this.error.push('nome e obrigatorio')
    if(!this.body.email && !this.body.telefone) this.error.push('Telefone ou email devem ser prenchido')
}   

Contato.prototype.cleanUp = function(){
    //Valida que os dados passados pelo formularios sao uma string
    for(const key in this.body){
        if(typeof this.body[key] !== 'string'){
            this.body[key] = ''
        }
    }

    this.body = {
        //coloca o body so os campos necessarios email e senha sem o csrf
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
}

module.exports = Contato
