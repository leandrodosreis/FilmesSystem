//Import express
const express = require ('express')

const bodyParser = require('body-parser')
//Permitindo a utilização do body das requisições
const bodyParserJSON = bodyParser.json()
 

//Criando objeto de rota para os endpoints de genero
const router = express.Router()

//Import da controller genero
const controllerGenero = require('../controller/genero/controller_genero.js')

//ENPOINTS GENERO

router.post('/', bodyParserJSON, async function(request, response){
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerGenero.inserirNovoGenero(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    
    let result = await controllerGenero.listarGenero()

    response.status(result.status_code)
    response.json(result)
    
})

router.get('/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerGenero.buscarGenero(id)
    
    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON ,async function(request, response){

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerGenero.atualizarGenero(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerGenero.excluirGenero(id)

    response.status(result.status_code)
    response.json(result)
    
})

///export do objeto de rotas do genero
module.exports = router