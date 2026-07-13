//Import das dependencias para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
//Permitindo a utilização do body das requisições
const bodyParserJSON = bodyParser.json()

//Criando um objeto do express para criar a API
const app = express()

//Configurações do cors da API
const cosrsOptions = {
    origin : ['*'],  //Configuração de origem da requisição (IP ou o dominio)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //Configuração dos metodos que serão utilizados na API
    allowedHeaders: ['Content-type', 'Authorization']   //Configurações de permissoes
                    //Tipode de dados   Autorização de acesso

}

//Aplica as configurações do cors no app (Express)
app.use(cors(cosrsOptions))

//Import das controllers
const filmeRouter = require('./routes/filmes.router.js')
app.use('/v1/senai/locadora/filme', cors(), filmeRouter)

const classificacaoRouter = require('./routes/classificacao.router.js')
app.use('/v1/senai/locadora/classificacao', cors(), classificacaoRouter)

const cargoRouter = require('./routes/cargo.router.js')
app.use('/v1/senai/locadora/cargo', cors(), cargoRouter)

const nacionalidadeRouter = require('./routes/nacionalidade.router.js')
app.use('/v1/senai/locadora/nacionalidade', cors(), nacionalidadeRouter)

const sexoRouter = require('./routes/sexo.router.js')
app.use('/v1/senai/locadora/sexo',cors(), sexoRouter)

const pessoaRouter = require('./routes/pessoa.router.js')
app.use('/v1/senai/locadora/pessoa',cors(), pessoaRouter)

const generoRouter = require('./routes/genero.router.js')
app.use('/v1/senai/locadora/genero', cors(), generoRouter)

//Logica da ordem DAO > Controller > app

//Fazer o start na API(aguardando as requisições)
app.listen(3030, function(){
    console.log('API aguaradando novas requisições ...')
})