/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de cargo
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

const cargoDAO = require('../../model/DAO/cargo/cargo.js')

const configMessages = require('../modulo/configMessages.js')

const inserirNovoCargo = async function (cargo, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
    
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(cargo)

            if(validar){

                return validar
        
            }else{

                let result = await cargoDAO.insertCargo(await tratarDados(cargo))

                if(result){

                    cargo.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = cargo

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

const listarCargos = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await cargoDAO.selectAllCargo()
        
        if(result.length > 0){
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.cargo = result

            return customMessage.DEFAULT_MESSAGE

        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

const buscarCargo = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if(id == undefined || id == null || id == '' || isNaN(id) || String(id).replaceAll(' ','') == '' || id <= 0){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            let result = await cargoDAO.selectByIdCargo(id)
            if(result){

                if(result.length > 0){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.cargo = result

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

const atualizarCargo = async function (cargo, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarCargo = await buscarCargo(id)

            if(resultBuscarCargo.status){

                let validar = await validarDados(await tratarDados(cargo))

                if(!validar){

                    cargo.id = Number(id)

                    let result = await cargoDAO.updateCargo(cargo)

                        if(result){
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = cargo

                        return customMessage.DEFAULT_MESSAGE

                        }else{

                        return customMessage.ERROR_INTERNAL_SERVER_MODEL

                        }

                }else{
                    return validar
                }

            }else{
                return resultBuscarCargo
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirCargo = async function (id) {
    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarCargo = await buscarCargo(id)

        if(resultBuscarCargo.status){

            let result = await cargoDAO.deleteCargo(id)

            //Se a exclusão ocorrer corretamente retornamos uma mensagem de sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

                //Se a exclusãofalhar o erro foi na moedel
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{

            return resultBuscarCargo
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const validarDados = async function (cargo) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        if(cargo.funcao == undefined || cargo.funcao == "" || cargo.funcao == null || cargo.funcao.length > 30){

            customMessage.ERROR_BAD_REQUEST.field = '[FUNCAO] INVALIDA'

            return customMessage.ERROR_BAD_REQUEST

        }else{

            return false
        }

    } catch (error) {
        return false
    }
}

const tratarDados = async function (cargo) {
    cargo.funcao            = cargo.funcao.replaceAll("'", "")

    return cargo
}

module.exports = {
    inserirNovoCargo,
    listarCargos,
    buscarCargo,
    atualizarCargo,
    excluirCargo
}