/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de genero
Data: 17/04/2026
Autor: Leandro
Versão: 1.0
*/

// Import do arquivo de configurações de mensagens padrão da API
const configMessages = require('../modulo/configMessages.js')

// Import do DAO responsável pelas operações de nacionalidade no banco de dados
const nacionalidadeDAO = require('../../model/DAO/nacionalidade/nacionalidade.js')

// Função para inserir uma nova nacionalidade
const inserirNovoNacionalidade = async function(nacionalidade, contentType){

    // Cria uma cópia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Verifica se o Content-Type da requisição é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
    
            // Valida os dados recebidos
            let validar = await validarDados(nacionalidade)

            // Caso exista erro de validação retorna a mensagem correspondente
            if(validar){

                return validar

            }else{

                // Realiza o tratamento dos dados e envia para o DAO efetuar o insert
                let result = await nacionalidadeDAO.insertNacionalidade(
                    await tratarDados(nacionalidade)
                )

                // Verifica se a inserção ocorreu com sucesso
                if(result){

                    // Adiciona ao objeto o ID gerado pelo banco
                    nacionalidade.id = result

                    // Monta a resposta de sucesso
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = nacionalidade

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    // Erro ocorrido na camada Model
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

// Função para listar todas as nacionalidades cadastradas
const listarNacionalidade = async function () {

    // Cria uma cópia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todas as nacionalidades cadastradas no banco
        let result = await nacionalidadeDAO.selectAllNacionalidade()

        // Verifica se o DAO retornou dados
        if(result){
            
            // Verifica se existem registros retornados
            if(result.length > 0){

                // Monta a resposta de sucesso
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.nacionalidade = result

                return customMessage.DEFAULT_MESSAGE

            }else{

                // Nenhum registro encontrado
                return configMessages.ERROR_NOT_FOUND
            }

        }else{

            // Erro ocorrido na camada Model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

// Função para buscar uma nacionalidade pelo ID
const buscarNacionalidade = async function (id) {

    // Cria uma cópia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Valida se o ID informado é válido
        if(
            id == undefined ||
            String(id).replaceAll(' ','') == "" ||
            id == null ||
            isNaN(id) ||
            id <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Busca a nacionalidade correspondente ao ID informado
            let result = await nacionalidadeDAO.selectByIdNacionalidade(id)

            // Verifica se o DAO retornou dados
            if(result){

                // Verifica se existe algum registro encontrado
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.nacionalidade = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    // Nacionalidade não encontrada
                    return customMessage.ERROR_NOT_FOUND

                }

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para atualizar uma nacionalidade existente
const atualizarNacionalidade = async function (nacionalidade, id, contentType) {

    // Cria uma cópia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o Content-Type da requisição é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            
            // Verifica se a nacionalidade existe antes de atualizar
            let resultBuscarNacionalidade = await buscarNacionalidade(id)

            if(resultBuscarNacionalidade.status){

                // Valida os dados que serão atualizados
                let validar = await validarDados(
                    await tratarDados(nacionalidade)
                )

                if(!validar){
                    
                    // Adiciona o ID ao objeto que será enviado ao DAO
                    nacionalidade.id = Number(id)

                    // Solicita ao DAO a atualização do registro
                    let result = await nacionalidadeDAO.updateNacionalidade(nacionalidade)

                    // Verifica se a atualização ocorreu com sucesso
                    if(result){

                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = nacionalidade

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

                // Retorna o erro informado pela função buscarNacionalidade
                return resultBuscarNacionalidade

            }

        }else{

            // Content-Type inválido
            return customMessage.ERROR_CONTENT_TYPE
        }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para excluir uma nacionalidade
const excluirNacionalidade = async function (id) {

    // Cria uma cópia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se a nacionalidade existe antes da exclusão
        let resultBuscarNacionalidade = await buscarNacionalidade(id)

        if(resultBuscarNacionalidade.status){

            // Solicita ao DAO a exclusão do registro
            let result = await nacionalidadeDAO.deleteNacionalidade(id)

            // Exclusão realizada com sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{

            // Retorna o erro informado pela função buscarNacionalidade
            return resultBuscarNacionalidade
        }
        
    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função responsável por validar os dados obrigatórios da nacionalidade
const validarDados = async function(nacionalidade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    // Validação do nome da nacionalidade
    if(
        nacionalidade.nome == undefined ||
        nacionalidade.nome == "" ||
        nacionalidade.nome == null ||
        nacionalidade.nome.length > 50
    ){

        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else{

        // Retorna false indicando que não houve erros de validação
        return false
    }
}

// Função responsável pelo tratamento dos dados recebidos
const tratarDados = async function(nacionalidade) {

    // Remove aspas simples para evitar caracteres indesejados
    nacionalidade.nome = nacionalidade.nome.replaceAll("'", "")

    return nacionalidade
} 

// Exportação das funções da controller
module.exports = {
    inserirNovoNacionalidade,
    buscarNacionalidade,
    listarNacionalidade,
    excluirNacionalidade,
    atualizarNacionalidade
}