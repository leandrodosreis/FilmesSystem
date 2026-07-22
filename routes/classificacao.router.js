/*
Objetivo: Arquivo responsável pelas rotas da classificação
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/


// Import do framework Express para criação das rotas da API
const express = require('express')

// Import da biblioteca body-parser para manipulação do corpo das requisições
const bodyParser = require('body-parser')

// Permite a utilização do body das requisições no formato JSON
const bodyParserJSON = bodyParser.json()


// Criação do objeto Router responsável pelos endpoints de classificação
const router = express.Router()


// Import do controller responsável pelas regras de negócio da classificação
const controllerClassificacao = require('../controller/classificacao/controller_classificacao.js')

// ENDPOINTS CLASSIFICACAO

// Rota responsável por cadastrar uma nova classificação
// Método HTTP: POST
// Necessita receber dados no body da requisição
router.post('/', bodyParserJSON, async function (request, response) {

    // Recebe os dados enviados no corpo da requisição
    let dados = request.body

    // Recebe o tipo de conteúdo enviado na requisição
    // Utilizado para validar se os dados estão no formato JSON
    let contentType = request.headers['content-type']

    // Encaminha os dados recebidos para o controller realizar a inserção
    let result = await controllerClassificacao.inserirNovaClassificacao(dados, contentType)

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna os dados da operação em formato JSON
    response.json(result)

})


// Rota responsável por listar todas as classificações cadastradas
// Método HTTP: GET
// Não necessita receber body na requisição
router.get('/', async function (request, response) {

    // Chama o controller responsável por buscar todas as classificações
    let result = await controllerClassificacao.listarClassificacao()

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna a lista de classificações em formato JSON
    response.json(result)
    
})


// Rota responsável por buscar uma classificação pelo ID
// Método HTTP: GET
// Recebe o identificador através dos parâmetros da URL
router.get('/:id', async function (request, response) {

    // Recebe o ID da classificação enviado pela URL
    let id = request.params.id
    
    // Encaminha o ID para o controller realizar a busca
    let result = await controllerClassificacao.buscarClassificacao(id)
    
    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna os dados encontrados em formato JSON
    response.json(result)
    
})


// Rota responsável por atualizar uma classificação existente
// Método HTTP: PUT
// Recebe o ID pela URL e os novos dados pelo body
router.put('/:id', bodyParserJSON, async function (request, response) {

    // Recebe o tipo de conteúdo enviado na requisição
    let contentType = request.headers['content-type']

    // Recebe o ID do registro que será atualizado
    let id = request.params.id

    // Recebe os dados que serão modificados no banco de dados
    let dados = request.body

    // Encaminha os dados, ID e content-type para o controller realizar a atualização
    let result = await controllerClassificacao.atualizarClassificacao(dados, id, contentType)

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna o resultado da atualização em formato JSON
    response.json(result)
})


// Rota responsável por excluir uma classificação existente
// Método HTTP: DELETE
// Recebe o ID através dos parâmetros da URL
router.delete('/:id', async function (request, response) {

    // Recebe o ID da classificação que será excluída
    let id = request.params.id

    // Encaminha o ID para o controller realizar a exclusão
    let result = await controllerClassificacao.excluirClassificacao(id)

    // Retorna o status HTTP recebido do controller
    response.status(result.status_code)

    // Retorna o resultado da exclusão em formato JSON
    response.json(result)
    
})


// Exporta as rotas para serem utilizadas no arquivo principal da aplicação
module.exports = router