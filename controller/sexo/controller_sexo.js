/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de sexo
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

// Import do DAO responsável pelas operações de sexo no banco de dados
const sexoDAO = require('../../model/DAO/sexo/sexo.js')

// Import do arquivo de configurações de mensagens padrão da API
const configMessages = require('../modulo/configMessages.js')

// Função para inserir um novo sexo
const inserirNovaSexo = async function (sexo, contentType) {

    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
    
        // Valida se o conteúdo enviado no body é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Valida os dados recebidos
            let validar = await validarDados(sexo)

            // Caso exista erro de validação retorna a mensagem correspondente
            if(validar){

                return validar
        
            }else{

                // Encaminha os dados tratados para o DAO realizar a inserção
                let result = await sexoDAO.InsertSexo(
                    await tratarDados(sexo)
                )

                // Verifica se a inserção ocorreu com sucesso
                if(result){

                    // Adiciona ao objeto o ID gerado pelo banco de dados
                    sexo.id = result

                    // Monta a resposta de sucesso
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = sexo

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

// Função para listar todos os sexos cadastrados
const listarSexo = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todos os registros de sexo cadastrados no banco
        let result = await sexoDAO.selectAllSexo()
        
        // Verifica se existem registros retornados
        if(result.length > 0){

            // Monta a resposta de sucesso
            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.sexo = result

            return customMessage.DEFAULT_MESSAGE

        }else{

            // Nenhum registro encontrado ou falha na camada Model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        return configMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

// Função para buscar um sexo pelo ID
const buscarSexo = async function (id) {

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

            // Busca o sexo correspondente ao ID informado
            let result = await sexoDAO.selectByIdSexo(id)

            // Verifica se o DAO retornou dados
            if(result){

                // Verifica se existe algum registro encontrado
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.sexo = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    // Registro não encontrado
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

// Função para atualizar um registro de sexo
const atualizarSexo = async function (sexo, id, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))
    
    try {
        
        // Verifica se o Content-Type da requisição é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Verifica se o registro existe antes da atualização
            let resultBuscarSexo = await buscarSexo(id)

            if(resultBuscarSexo.status){

                // Valida os dados que serão atualizados
                let validar = await validarDados(
                    await tratarDados(sexo)
                )

                if(!validar){

                    // Adiciona o ID ao objeto que será enviado ao DAO
                    sexo.id = Number(id)

                    // Solicita ao DAO a atualização do registro
                    let result = await sexoDAO.updateSexo(sexo)

                    // Verifica se a atualização ocorreu com sucesso
                    if(result){

                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = sexo

                        return customMessage.DEFAULT_MESSAGE

                    }else{

                        // Erro ocorrido na camada Model
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL

                    }

                }else{

                    // Retorna o erro identificado na validação
                    return validar
                }

            }else{

                // Retorna o erro informado pela função buscarSexo
                return resultBuscarSexo
            }

        }else{

            // Content-Type inválido
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para excluir um registro de sexo
const excluirSexo = async function (id) {

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o registro existe antes da exclusão
        let resultBuscarSexo = await buscarSexo(id)

        if(resultBuscarSexo.status){

            // Solicita ao DAO a exclusão do registro
            let result = await sexoDAO.deleteSexo(id)

            // Exclusão realizada com sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{

            return resultBuscarSexo
        }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função responsável por validar os dados obrigatórios do sexo
const validarDados = async function (sexo) {
    
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Validação da sigla
        if(
            sexo.sigla == undefined ||
            sexo.sigla == "" ||
            sexo.sigla == null ||
            sexo.sigla.length > 5
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[SIGLA] INVALIDA'

            return customMessage.ERROR_BAD_REQUEST

        // Validação do nome
        }else if(
            sexo.nome == undefined ||
            sexo.nome == "" ||
            sexo.nome == null ||
            sexo.nome.length > 15
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'

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
const tratarDados = async function (sexo) {

    // Remove aspas simples para evitar caracteres indesejados
    sexo.sigla = sexo.sigla.replaceAll("'", "")
    sexo.nome = sexo.nome.replaceAll("'", "")

    return sexo
}

// Exportação das funções da controller
module.exports = {
    inserirNovaSexo,
    listarSexo,
    buscarSexo,
    atualizarSexo,
    excluirSexo
}