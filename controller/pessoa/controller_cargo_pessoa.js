/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de cargo pessoa
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/

const cargoPessoaDAO = require('../../model/DAO/cargo_pessoa/cargo_pessoa.js')

const configMessages = require('../modulo/configMessages.js')

const inserirNovoCargoPessoa = async function(cargoPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let validar = await validarDados(cargoPessoa)

        if(!validar){

            let result =
                await cargoPessoaDAO.insertCargoPessoa(cargoPessoa)

            if(result){

                cargoPessoa.id = result

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_CREATED_ITEM.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_CREATED_ITEM.status_code

                customMessage.DEFAULT_MESSAGE.message =
                    customMessage.SUCCESS_CREATED_ITEM.message

                customMessage.DEFAULT_MESSAGE.response = cargoPessoa

                return customMessage.DEFAULT_MESSAGE

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL

            }

        }else{

            return validar

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const listarCargoPessoa = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await cargoPessoaDAO.selectAllCargoPessoa()

        if(result){

            if(result.length > 0){

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.count =
                    result.length

                customMessage.DEFAULT_MESSAGE.response.cargo_pessoa =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                return customMessage.ERROR_NOT_FOUND

            }

        }else{

            return customMessage.ERROR_INTERNAL_SERVER_MODEL

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const buscarCargoPessoa = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(
            id == undefined ||
            id == null ||
            id == '' ||
            isNaN(id) ||
            id <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field =
                '[ID] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }

        let result =
            await cargoPessoaDAO.selectByIdCargoPessoa(id)

        if(result){

            if(result.length > 0){

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.cargo_pessoa =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                return customMessage.ERROR_NOT_FOUND

            }

        }else{

            return customMessage.ERROR_INTERNAL_SERVER_MODEL

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const buscarCargoIdPessoa = async function(idPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(
            idPessoa == undefined ||
            idPessoa == null ||
            idPessoa == '' ||
            isNaN(idPessoa) ||
            idPessoa <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field =
                '[ID_PESSOA] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }

        let result =
            await cargoPessoaDAO.selectCargosByIdPessoa(idPessoa)

        if(result){

            if(result.length > 0){

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.cargo_pessoa =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                return customMessage.ERROR_NOT_FOUND

            }

        }else{

            return customMessage.ERROR_INTERNAL_SERVER_MODEL

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const buscarPessoaIdCargo = async function(idCargo){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if(
            idCargo == undefined ||
            idCargo == null ||
            idCargo == '' ||
            isNaN(idCargo) ||
            idCargo <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field =
                '[ID_CARGO] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }

        let result =
            await cargoPessoaDAO.selectPessoasByIdCargo(idCargo)

        if(result){

            if(result.length > 0){

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.cargo_pessoa =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                return customMessage.ERROR_NOT_FOUND

            }

        }else{

            return customMessage.ERROR_INTERNAL_SERVER_MODEL

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const atualizarCargoPessoa = async function(cargoPessoa, id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscar = await buscarCargoPessoa(id)

        if(resultBuscar.status){

            let validar = await validarDados(cargoPessoa)

            if(!validar){

                cargoPessoa.id = Number(id)

                let result =
                    await cargoPessoaDAO.updateCargoPessoa(cargoPessoa)

                if(result){

                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_UPDATED_ITEM.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_UPDATED_ITEM.status_code

                    customMessage.DEFAULT_MESSAGE.message =
                        customMessage.SUCCESS_UPDATED_ITEM.message

                    customMessage.DEFAULT_MESSAGE.response =
                        cargoPessoa

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    return customMessage.ERROR_INTERNAL_SERVER_MODEL

                }

            }else{

                return validar

            }

        }else{

            return resultBuscar

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const excluirCargoPessoa = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscar =
            await buscarCargoPessoa(id)

        if(resultBuscar.status){

            let result =
                await cargoPessoaDAO.deleteCargoPessoa(id)

            if(result){

                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL

            }

        }else{

            return resultBuscar

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const excluirCargoIdPessoa = async function(idPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result =
            await cargoPessoaDAO.deleteCargosByIdPessoa(idPessoa)

        if(result){

            return customMessage.SUCCESS_DELETED_ITEM

        }else{

            return customMessage.ERROR_INTERNAL_SERVER_MODEL

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const validarDados = async function(cargoPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(
        cargoPessoa.id_pessoa == undefined ||
        cargoPessoa.id_pessoa == null ||
        cargoPessoa.id_pessoa == '' ||
        isNaN(cargoPessoa.id_pessoa)
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[ID_PESSOA] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    }else if(
        cargoPessoa.id_cargo == undefined ||
        cargoPessoa.id_cargo == null ||
        cargoPessoa.id_cargo == '' ||
        isNaN(cargoPessoa.id_cargo)
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[ID_CARGO] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    }else{

        return false

    }

}

module.exports = {
    inserirNovoCargoPessoa,
    listarCargoPessoa,
    buscarCargoPessoa,
    buscarCargoIdPessoa,
    buscarPessoaIdCargo,
    atualizarCargoPessoa,
    excluirCargoPessoa,
    excluirCargoIdPessoa
}