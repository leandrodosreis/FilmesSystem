const configMessages = require('../modulo/configMessages.js')

const cargoPessoaFilmeDAO =
require('../../model/DAO/pessoa/cargo_pessoa_filme.js')

const inserirNovoCargoPessoaFilme = async function(cargoPessoaFilme){

    let customMessage =
        JSON.parse(JSON.stringify(configMessages))

    try {

        let result =
            await cargoPessoaFilmeDAO.insertCargoPessoaFilme(cargoPessoaFilme)

        if(result){

            cargoPessoaFilme.id = result

            customMessage.DEFAULT_MESSAGE.status =
                customMessage.SUCCESS_CREATED_ITEM.status

            customMessage.DEFAULT_MESSAGE.status_code =
                customMessage.SUCCESS_CREATED_ITEM.status_code

            customMessage.DEFAULT_MESSAGE.message =
                customMessage.SUCCESS_CREATED_ITEM.message

            customMessage.DEFAULT_MESSAGE.response =
                cargoPessoaFilme

            return customMessage.DEFAULT_MESSAGE

        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarCargoPessoaIdFilme = async function(idFilme){

    let customMessage =
        JSON.parse(JSON.stringify(configMessages))

    try {

        let result =
            await cargoPessoaFilmeDAO.selectCargoPessoaByIdFilme(idFilme)

        if(result){

            if(result.length > 0){

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.cargo_pessoa_filme =
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

const excluirCargoPessoaIdFilme = async function(idFilme){

    let customMessage =
        JSON.parse(JSON.stringify(configMessages))

    try {

        let result =
            await cargoPessoaFilmeDAO.deleteCargoPessoaByIdFilme(idFilme)

        if(result){
            return customMessage.SUCCESS_DELETED_ITEM
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoCargoPessoaFilme,
    buscarCargoPessoaIdFilme,
    excluirCargoPessoaIdFilme
}