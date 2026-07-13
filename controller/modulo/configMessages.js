/*
Objetivo: Arquiuvo responsavel pela padronixação das mensagens e status code do projeto de filmes
Data: 17/04/2026
Autor Leandro
Versão: 1.0
*/

//Padrinização dos retornos da API
const DEFAULT_MESSAGE = {
    api_description: 'API para controlar projeto de Filmes',
    development: 'Leandro dos Reis',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    response: {}
}

//Mensagens de erro do projeto de filmes
const ERROR_BAD_REQUEST                 = {status: false, status_code: 400, message: 'Não foi possivel processar a requisição devido a erro de entrada de dados.'}
const ERROR_NOT_FOUND                   = {status: false, status_code: 404, message: 'Não foram encontrados dados para retorno.'}
const ERROR_CONTENT_TYPE                = {status: false, status_code: 415, message: 'Não foi possivel processar a requisição devido a erro de tipo de dado.'}
const ERROR_INTERNAL_SERVER_MODEL       = {status: false, status_code: 500, message: 'Não foi possivel processar a requisição devido a um erro interno no servidor [MODEL]'}
const ERROR_INTERNAL_SERVER_CONTROLLER  = {status: false, status_code: 500, message: 'Não foi possivel processar a requisição devido a um erro interno no servidor [CONTROLLER]'}

//Mensagens de SUCESSO do projeto de filmes
const SUCCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'Item inserido com sucesso!'}
const SUCCESS_CREATED_ITEM_WARNING = {status: true, status_code: 201, message: 'Item inserido com sucesso, porém algums dados tiveram problemas no cadastro [DADOS DE RELACIONAMENTOS]!'}
const SUCCESS_RESPONSE     = {status: true, status_code: 200}
const SUCCESS_UPDATED_ITEM = {status: true, status_code: 200, message: 'Item atualizado com sucesso!'}
const SUCCESS_DELETED_ITEM = {status: true, status_code: 200, message: 'Item deletado com sucesso!'}

module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_NOT_FOUND,
    SUCCESS_RESPONSE,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_CREATED_ITEM_WARNING
}