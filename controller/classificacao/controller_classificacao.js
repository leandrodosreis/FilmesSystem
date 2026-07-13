/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de classificacao
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

const classificacaoDAO = require('../../model/DAO/classificacao/classificacao.js')

const configMessages = require('../modulo/configMessages.js')

const inserirNovaClassificacao = async function (classificacao, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
    
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(classificacao)

            if(validar){

                return validar
        
            }else{

                let result = await classificacaoDAO.InsertClassificacao(await tratarDados(classificacao))

                if(result){

                    classificacao.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = classificacao

                    return customMessage.DEFAULT_MESSAGE

                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        }else{

            return customMessage.ERROR_CONTENT_TYPE

        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const listarClassificacao = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await classificacaoDAO.selectAllClassificacao()
        
        if(result.length > 0){
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.classificacao = result

            return customMessage.DEFAULT_MESSAGE

        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

const buscarClassificacao = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if(id == undefined || id == null || id == '' || isNaN(id) || String(id).replaceAll(' ','') == '' || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            let result = await classificacaoDAO.selectByIdClassificacao(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.classificacao = result

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_NOT_FOUND
                }

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }

    } catch (error) {
        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarClassificacao = async function (classificacao, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarClassificacao = await buscarClassificacao(id)

            if(resultBuscarClassificacao.status){

                let validar = await validarDados(await tratarDados(classificacao))

                if(!validar){

                    classificacao.id = Number(id)

                    let result = await classificacaoDAO.updateClassificacao(classificacao)

                        if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = classificacao

                        return customMessage.DEFAULT_MESSAGE

                        }else{

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

const excluirClassificacao = async function (id) {
    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarClassificacao = await buscarClassificacao(id)

        if(resultBuscarClassificacao.status){

            let result = await classificacaoDAO.deleteClassificacao(id)

            //Se a exclusão ocorrer corretamente retornamos uma mensagem de sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

                //Se a exclusãofalhar o erro foi na moedel
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{

            return resultBuscarClassificacao
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const validarDados = async function (classificacao) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if(classificacao.sigla == undefined || classificacao.sigla == "" || classificacao.sigla == null || classificacao.sigla.length > 5){

            customMessage.ERROR_BAD_REQUEST.field = '[SIGLA] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }else if(classificacao.nome == undefined || classificacao.nome == "" || classificacao.nome == null || classificacao.nome.length > 45){

            customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }else if(classificacao.descricao == undefined || classificacao.descricao == "" || classificacao.descricao == null || classificacao.descricao.length > 200){

            customMessage.ERROR_BAD_REQUEST.field = '[CLASSIFICACAO] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }else{

            return false
        }

    } catch (error) {
        return false
    }
}

const tratarDados = async function (classificacao) {
    classificacao.sigla            = classificacao.sigla.replaceAll("'", "")
    classificacao.nome            = classificacao.nome.replaceAll("'", "")
    classificacao.descricao            = classificacao.descricao.replaceAll("'", "")

    return classificacao
}

module.exports = {
    inserirNovaClassificacao,
    listarClassificacao,
    buscarClassificacao,
    atualizarClassificacao,
    excluirClassificacao
}