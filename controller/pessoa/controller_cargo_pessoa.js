/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de cargo pessoa
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/

// Import do DAO responsável pelas operações da tabela cargo_pessoa
const cargoPessoaDAO = require('../../model/DAO/cargo_pessoa/cargo_pessoa.js')

// Import do arquivo de mensagens padronizadas
const configMessages = require('../modulo/configMessages.js')

// Função responsável por criar um novo relacionamento entre cargo e pessoa
const inserirNovoCargoPessoa = async function(cargoPessoa){

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Valida os dados recebidos
        let validar = await validarDados(cargoPessoa)

        // Se não houver erros de validação
        if(!validar){

            // Insere o relacionamento no banco de dados
            let result =
                await cargoPessoaDAO.insertCargoPessoa(cargoPessoa)

            // Verifica se a inserção ocorreu com sucesso
            if(result){

                // Adiciona o ID gerado pelo banco ao objeto
                cargoPessoa.id = result

                // Monta a resposta de sucesso
                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_CREATED_ITEM.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_CREATED_ITEM.status_code

                customMessage.DEFAULT_MESSAGE.message =
                    customMessage.SUCCESS_CREATED_ITEM.message

                customMessage.DEFAULT_MESSAGE.response = cargoPessoa

                return customMessage.DEFAULT_MESSAGE

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL

            }

        }else{

            // Retorna o erro de validação
            return validar

        }

    } catch (error) {

        // Erro inesperado na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

// Função responsável por listar todos os relacionamentos cargo_pessoa
const listarCargoPessoa = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todos os registros
        let result = await cargoPessoaDAO.selectAllCargoPessoa()

        // Verifica se o DAO retornou dados
        if(result){

            // Verifica se existem registros
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

                // Nenhum relacionamento encontrado
                return customMessage.ERROR_NOT_FOUND

            }

        }else{

            // Erro na Model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL

        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

// Função responsável por buscar um relacionamento através do ID
const buscarCargoPessoa = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID
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

        // Busca o relacionamento pelo ID
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

// Função responsável por buscar os cargos relacionados a uma pessoa
const buscarCargoIdPessoa = async function(idPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID da pessoa
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

        // Busca os cargos vinculados à pessoa
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

// Função responsável por buscar as pessoas relacionadas a um cargo
const buscarPessoaIdCargo = async function(idCargo){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID do cargo
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

        // Busca as pessoas vinculadas ao cargo
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

// Função responsável por atualizar um relacionamento cargo_pessoa
const atualizarCargoPessoa = async function(cargoPessoa, id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o relacionamento existe
        let resultBuscar = await buscarCargoPessoa(id)

        if(resultBuscar.status){

            // Valida os novos dados
            let validar = await validarDados(cargoPessoa)

            if(!validar){

                // Adiciona o ID ao objeto
                cargoPessoa.id = Number(id)

                // Atualiza o relacionamento
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

// Função responsável por excluir um relacionamento pelo ID
const excluirCargoPessoa = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o relacionamento existe
        let resultBuscar =
            await buscarCargoPessoa(id)

        if(resultBuscar.status){

            // Exclui o relacionamento
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

// Função responsável por excluir todos os cargos vinculados a uma pessoa
const excluirCargoIdPessoa = async function(idPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Remove todos os relacionamentos da pessoa
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

// Função responsável pela validação dos dados do relacionamento
const validarDados = async function(cargoPessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    // Validação do ID da pessoa
    if(
        cargoPessoa.id_pessoa == undefined ||
        cargoPessoa.id_pessoa == null ||
        cargoPessoa.id_pessoa == '' ||
        isNaN(cargoPessoa.id_pessoa)
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[ID_PESSOA] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    // Validação do ID do cargo
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

        // Nenhum erro encontrado
        return false

    }

}

// Exportação das funções da controller
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