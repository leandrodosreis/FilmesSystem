//Import express
const express = require ('express')

const bodyParser = require('body-parser')
//Permitindo a utilização do body das requisições
const bodyParserJSON = bodyParser.json()
 

//Criando objeto de rota para os endpoints de genero
const router = express.Router()

const controllerCargo = require('../controller/cargo/controller_cargo.js')

//ENDPOINTS CARGO

router.post('/', bodyParserJSON, async function (request, response) {
    
    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerCargo.inserirNovoCargo(dados, contentType)

    response.status(result.status_code)
    response.json(result)

})

router.get('/', async function (request, response) {
    
    let result = await controllerCargo.listarCargos()

    response.status(result.status_code)
    response.json(result)
    
})

router.get('/:id', async function (request, response) {

    let id = request.params.id
    
    let result = await controllerCargo.buscarCargo(id)
    
    response.status(result.status_code)
    response.json(result)
    
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    
    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerCargo.atualizarCargo(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {

    let id = request.params.id

    let result = await controllerCargo.excluirCargo(id)

    response.status(result.status_code)
    response.json(result)
    
})

module.exports = router