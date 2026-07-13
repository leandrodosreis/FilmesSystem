/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de classificacao
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

const sexoDAO = require('../../model/DAO/sexo/sexo.js')

const configMessages = require('../modulo/configMessages.js')


const inserirNovaSexo = async function (sexo, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
    
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(sexo)

            if(validar){

                return validar
        
            }else{

                let result = await sexoDAO.InsertSexo(await tratarDados(sexo))

                if(result){

                    sexo.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = sexo

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

const listarSexo = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await sexoDAO.selectAllSexo()
        
        if(result.length > 0){
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.sexo = result

            return customMessage.DEFAULT_MESSAGE

        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

const buscarSexo = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if(id == undefined || id == null || id == '' || isNaN(id) || String(id).replaceAll(' ','') == '' || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            let result = await sexoDAO.selectByIdSexo(id)

            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.sexo = result

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

const atualizarSexo = async function (sexo, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarSexo = await buscarSexo(id)

            if(resultBuscarSexo.status){

                let validar = await validarDados(await tratarDados(sexo))

                if(!validar){

                    sexo.id = Number(id)

                    let result = await sexoDAO.updateSexo(sexo)

                        if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = sexo

                        return customMessage.DEFAULT_MESSAGE

                        }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL

                        }

                }else{
                    return validar
                }

            }else{
                return resultBuscarSexo
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirSexo = async function (id) {
    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarSexo = await buscarSexo(id)

        if(resultBuscarSexo.status){

            let result = await sexoDAO.deleteSexo(id)

            //Se a exclusão ocorrer corretamente retornamos uma mensagem de sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

                //Se a exclusãofalhar o erro foi na moedel
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{

            return resultBuscarSexo
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const validarDados = async function (sexo) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if(sexo.sigla == undefined || sexo.sigla == "" || sexo.sigla == null || sexo.sigla.length > 5){

            customMessage.ERROR_BAD_REQUEST.field = '[SIGLA] INVALIDA'

            return customMessage.ERROR_BAD_REQUEST

        }else if(sexo.nome == undefined || sexo.nome == "" || sexo.nome == null || sexo.nome.length > 15){

            customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }else{

            return false
        }

    } catch (error) {
        return false
    }
}

const tratarDados = async function (sexo) {
    sexo.sigla            = sexo.sigla.replaceAll("'", "")
    sexo.nome            = sexo.nome.replaceAll("'", "")

    return sexo
}

module.exports = {
    inserirNovaSexo,
    listarSexo,
    buscarSexo,
    atualizarSexo,
    excluirSexo
}