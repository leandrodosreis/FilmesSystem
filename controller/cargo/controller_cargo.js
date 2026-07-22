/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de cargo
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

// Import do DAO responsável pelas operações de cargo no banco de dados
const cargoDAO = require('../../model/DAO/cargo/cargo.js')

// Import do arquivo de configurações de mensagens padrão da API
const configMessages = require('../modulo/configMessages.js')

// Função para inserir um novo cargo
const inserirNovoCargo = async function (cargo, contentType) {

    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
    
        // Valida se o conteúdo enviado no body é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Valida os dados recebidos
            let validar = await validarDados(cargo)

            // Caso exista erro de validação retorna a mensagem correspondente
            if(validar){

                return validar
        
            }else{

                // Encaminha os dados tratados para o DAO realizar a inserção
                let result = await cargoDAO.insertCargo(
                    await tratarDados(cargo)
                )

                // Verifica se a inserção ocorreu com sucesso
                if(result){

                    // Adiciona ao JSON o ID gerado pelo banco de dados
                    cargo.id = result

                    // Monta a resposta de sucesso
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = cargo

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

// Função para listar todos os cargos cadastrados
const listarCargos = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todos os cargos cadastrados no banco de dados
        let result = await cargoDAO.selectAllCargo()
        
        // Verifica se existem registros retornados
        if(result.length > 0){

            // Monta a resposta de sucesso
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.cargo = result

            return customMessage.DEFAULT_MESSAGE

        }else{

            // Nenhum registro encontrado ou falha na camada Model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

// Função para buscar um cargo pelo ID
const buscarCargo = async function (id) {

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

            // Busca o cargo correspondente ao ID informado
            let result = await cargoDAO.selectByIdCargo(id)

            // Verifica se o DAO retornou dados
            if(result){

                // Verifica se existe algum registro no array retornado
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.cargo = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    // Nenhum cargo encontrado
                    return customMessage.ERROR_NOT_FOUND
                }

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }

    } catch (error) {

        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para atualizar um cargo existente
const atualizarCargo = async function (cargo, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
        // Valida se o conteúdo enviado é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Verifica se o cargo existe e se o ID informado é válido
            let resultBuscarCargo = await buscarCargo(id)

            if(resultBuscarCargo.status){

                // Valida os dados recebidos para atualização
                let validar = await validarDados(
                    await tratarDados(cargo)
                )

                if(!validar){

                    // Adiciona o ID ao objeto para envio ao DAO
                    cargo.id = Number(id)

                    // Solicita ao DAO a atualização do registro
                    let result = await cargoDAO.updateCargo(cargo)

                    if(result){

                        // Monta a resposta de sucesso
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = cargo

                        return customMessage.DEFAULT_MESSAGE

                    }else{

                        // Erro ocorrido na camada Model
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

// Função para excluir um cargo
const excluirCargo = async function (id) {

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o cargo existe antes de realizar a exclusão
        let resultBuscarCargo = await buscarCargo(id)

        if(resultBuscarCargo.status){

            // Solicita ao DAO a exclusão do registro
            let result = await cargoDAO.deleteCargo(id)

            // Exclusão realizada com sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{

            return resultBuscarCargo
        }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função responsável por validar os dados obrigatórios do cargo
const validarDados = async function (cargo) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validação da função do cargo
        if(
            cargo.funcao == undefined ||
            cargo.funcao == "" ||
            cargo.funcao == null ||
            cargo.funcao.length > 30
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[FUNCAO] INVALIDA'

            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Retorna false indicando que não houve erros de validação
            return false
        }

    } catch (error) {

        return false
    }
}

// Função responsável pelo tratamento dos dados recebidos
const tratarDados = async function (cargo) {

    // Remove aspas simples para evitar caracteres indesejados
    cargo.funcao = cargo.funcao.replaceAll("'", "")

    return cargo
}

// Exportação das funções da controller
module.exports = {
    inserirNovoCargo,
    listarCargos,
    buscarCargo,
    atualizarCargo,
    excluirCargo
}