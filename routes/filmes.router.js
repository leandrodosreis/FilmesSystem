//Import express
const express = require ('express')

const bodyParser = require('body-parser')
//Permitindo a utilização do body das requisições
const bodyParserJSON = bodyParser.json()
 

//Criando objeto de rota para os endpoints de genero
const router = express.Router()

const controllerFilme = require('../controller/filme/controller_filme.js')

//ENDPOINTS FILME
router.post('/', bodyParserJSON, async function(request, response){
    //Recebendo o body da requisição
    let dados = request.body

    //Recebendo o tipo de dados da requisição para validar se é json
    let contentType = request.headers['content-type']

    //Chama a função de inserir e encaminha os dados do filme e o contentType
    let result = await controllerFilme.inserirNovoFilme(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

//Não precisamos de bodyParserJson pois não vamos inserir nada no 'corpo'
router.get('/', async function(request, response){
    let result = await controllerFilme.listarFilme()

    response.status(result.status_code)
    response.json(result)
})

//Não precisamos de bodyParserJson pois não vamos inserir nada no 'corpo'
router.get('/:id', async function(request, response){
    //Recebe o id do filme via params
    let id = request.params.id

    let result = await controllerFilme.buscarFilme(id)

    response.status(result.status_code)
    response.json(result)
})

//por id tem que receber 3 coisas id, bodyparser e contenttype
router.put('/:id', bodyParserJSON, async function(request, response) {

    //Recebe o content-type da requisição para validar se é json
    let contentType = request.headers['content-type']

    //Recebe o id do registro a ser atualizado 
    let id = request.params.id

    //Recebe os dados do body, que seão modificados no bd
    let dados = request.body
    
    //Chama os dados para atualizar o dilme devemos encaminhar as variaveis na mesma sequencia que a função foi criada
    let result = await controllerFilme.atualizarFilme(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function(request, response){

    let id = request.params.id

    let result = await controllerFilme.excluirFilme(id)


    response.status(result.status_code)
    response.json(result)

})

module.exports = router