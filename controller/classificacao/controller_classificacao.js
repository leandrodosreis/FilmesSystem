/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de classificacao
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

// Import do DAO responsável pelas operações de classificação no banco de dados
const classificacaoDAO = require('../../model/DAO/classificacao/classificacao.js')

// Import do arquivo de configurações de mensagens padrão da API
const configMessages = require('../modulo/configMessages.js')

// Função para inserir uma nova classificação
const inserirNovaClassificacao = async function (classificacao, contentType) {

    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
    
        // Valida se o conteúdo enviado no body é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Valida os dados recebidos da classificação
            let validar = await validarDados(classificacao)

            // Caso exista algum erro de validação retorna a mensagem correspondente
            if(validar){

                return validar
        
            }else{

                // Encaminha os dados tratados para o DAO realizar a inserção
                let result = await classificacaoDAO.InsertClassificacao(
                    await tratarDados(classificacao)
                )

                // Verifica se a inserção ocorreu com sucesso
                if(result){

                    // Adiciona ao JSON o ID gerado pelo banco de dados
                    classificacao.id = result

                    // Monta a resposta de sucesso
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = classificacao

                    return customMessage.DEFAULT_MESSAGE

                }else{
                    // Erro ocorrido na camada Model (DAO)
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        }else{

            // Content-Type inválido
            return customMessage.ERROR_CONTENT_TYPE

        }
        
    } catch (error) {
        // Erro inesperado na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para listar todas as classificações cadastradas
const listarClassificacao = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todas as classificações cadastradas no banco
        let result = await classificacaoDAO.selectAllClassificacao()
        
        // Verifica se existem registros retornados
        if(result.length > 0){

            // Monta a resposta de sucesso
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.classificacao = result

            return customMessage.DEFAULT_MESSAGE

        }else{

            // Nenhum registro encontrado ou falha no model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

// Função para buscar uma classificação pelo ID
const buscarClassificacao = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Valida se o ID informado é válido
        if(
            id == undefined ||
            id == null ||
            id == '' ||
            isNaN(id) ||
            String(id).replaceAll(' ','') == '' ||
            id <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Busca a classificação pelo ID informado
            let result = await classificacaoDAO.selectByIdClassificacao(id)

            // Verifica se o DAO retornou dados
            if(result){

                // Verifica se existe algum registro no array
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.classificacao = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    // Nenhuma classificação encontrada
                    return customMessage.ERROR_NOT_FOUND
                }

            }else{

                // Erro ocorrido na Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }

    } catch (error) {

        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para atualizar uma classificação existente
const atualizarClassificacao = async function (classificacao, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
        // Valida o Content-Type da requisição
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Verifica se a classificação existe e se o ID é válido
            let resultBuscarClassificacao = await buscarClassificacao(id)

            if(resultBuscarClassificacao.status){

                // Valida os dados recebidos para atualização
                let validar = await validarDados(
                    await tratarDados(classificacao)
                )

                if(!validar){

                    // Adiciona o ID ao objeto enviado para o DAO
                    classificacao.id = Number(id)

                    // Solicita ao DAO a atualização do registro
                    let result = await classificacaoDAO.updateClassificacao(classificacao)

                    if(result){

                        // Monta a resposta de sucesso
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = classificacao

                        return customMessage.DEFAULT_MESSAGE

                    }else{

                        // Erro ocorrido na camada Model
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL

                    }

                }else{

                    return validar
                }

            }else{

                return resultBuscarClassificacao
            }

        }else{

            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para excluir uma classificação
const excluirClassificacao = async function (id) {

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se a classificação existe antes da exclusão
        let resultBuscarClassificacao = await buscarClassificacao(id)

        if(resultBuscarClassificacao.status){

            // Solicita ao DAO a exclusão do registro
            let result = await classificacaoDAO.deleteClassificacao(id)

            // Exclusão realizada com sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{

            return resultBuscarClassificacao
        }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função responsável por validar os dados obrigatórios da classificação
const validarDados = async function (classificacao) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validação da sigla
        if(
            classificacao.sigla == undefined ||
            classificacao.sigla == "" ||
            classificacao.sigla == null ||
            classificacao.sigla.length > 5
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[SIGLA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        // Validação do nome
        }else if(
            classificacao.nome == undefined ||
            classificacao.nome == "" ||
            classificacao.nome == null ||
            classificacao.nome.length > 45
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        // Validação da descrição
        }else if(
            classificacao.descricao == undefined ||
            classificacao.descricao == "" ||
            classificacao.descricao == null ||
            classificacao.descricao.length > 200
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[CLASSIFICACAO] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Retorna false indicando que não houve erros
            return false
        }

    } catch (error) {

        return false
    }
}

// Função responsável pelo tratamento dos dados recebidos
const tratarDados = async function (classificacao) {

    // Remove aspas simples para evitar caracteres indesejados
    classificacao.sigla      = classificacao.sigla.replaceAll("'", "")
    classificacao.nome       = classificacao.nome.replaceAll("'", "")
    classificacao.descricao  = classificacao.descricao.replaceAll("'", "")

    return classificacao
}

// Exportação das funções da controller
module.exports = {
    inserirNovaClassificacao,
    listarClassificacao,
    buscarClassificacao,
    atualizarClassificacao,
    excluirClassificacao
}