/*
Objetivo: Arquivo responsável pelas rotas de nacionalidade
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/


// Import do framework Express para criação das rotas da API
const express = require ('express')


// Import da biblioteca body-parser para manipulação do corpo das requisições
const bodyParser = require('body-parser')

// Permite a utilização do body das requisições no formato JSON
const bodyParserJSON = bodyParser.json()


// Criação do objeto Router responsável pelos endpoints de nacionalidade
const router = express.Router()


// Import do controller responsável pelas regras de negócio da nacionalidade
const controllerNacionalidade = require('../controller/nacionalidade/controller_nacionalidade.js')


// ===============================
// ENDPOINTS NACIONALIDADE
// ===============================


// Rota responsável por cadastrar uma nova nacionalidade
// Método HTTP: POST
// Necessita receber dados no body da requisição
router.post('/', bodyParserJSON, async function(request, response){

    // Recebe os dados enviados no corpo da requisição
    let dados = request.body

    // Recebe o tipo de conteúdo enviado na requisição
    // Utilizado para validar se os dados estão no formato JSON
    let contentType = request.headers['content-type']

    // Encaminha os dados e o content-type para o controller realizar a inserção
    let result = await controllerNacionalidade.inserirNovoNacionalidade(dados, contentType)
    
    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna o resultado da operação em formato JSON
    response.json(result)

})


// Rota responsável por listar todas as nacionalidades cadastradas
// Método HTTP: GET
// Não necessita receber body na requisição
router.get('/', async function (request, response) {
    
    // Chama o controller responsável por buscar todas as nacionalidades
    let result = await controllerNacionalidade.listarNacionalidade()

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna a lista de nacionalidades em formato JSON
    response.json(result)
    
})


// Rota responsável por buscar uma nacionalidade pelo ID
// Método HTTP: GET
// Recebe o identificador através dos parâmetros da URL
router.get('/:id', async function (request, response) {

    // Recebe o ID da nacionalidade enviado pela URL
    let id = request.params.id

    // Encaminha o ID para o controller realizar a busca
    let result = await controllerNacionalidade.buscarNacionalidade(id)
    
    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna os dados encontrados em formato JSON
    response.json(result)

})


// Rota responsável por atualizar uma nacionalidade existente
// Método HTTP: PUT
// Recebe o ID pela URL e os novos dados pelo body
router.put('/:id', bodyParserJSON ,async function(request, response){

    // Recebe o tipo de conteúdo enviado na requisição
    // Utilizado para validar se os dados estão no formato JSON
    let contentType = request.headers['content-type']

    // Recebe o ID do registro que será atualizado
    let id = request.params.id

    // Recebe os dados que serão modificados no banco de dados
    let dados = request.body

    // Encaminha os dados, ID e content-type para o controller realizar a atualização
    let result = await controllerNacionalidade.atualizarNacionalidade(dados, id, contentType)

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna o resultado da atualização em formato JSON
    response.json(result)

})


// Rota responsável por excluir uma nacionalidade existente
// Método HTTP: DELETE
// Recebe o ID através dos parâmetros da URL
router.delete('/:id', async function (request, response) {

    // Recebe o ID da nacionalidade que será excluída
    let id = request.params.id

    // Encaminha o ID para o controller realizar a exclusão
    let result = await controllerNacionalidade.excluirNacionalidade(id)

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna o resultado da exclusão em formato JSON
    response.json(result)
    
})


// Exporta o objeto de rotas de nacionalidade para ser utilizado no arquivo principal da aplicação
module.exports = router