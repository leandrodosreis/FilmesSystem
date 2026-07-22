/*
Objetivo: Arquivo responsável pela validação, tratamento e manipulação
dos dados para realizar operações na tabela de relacionamento
cargo_pessoa_filme.
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/

// Importa o arquivo de mensagens padronizadas do sistema
const configMessages = require('../modulo/configMessages.js')

// Importa o DAO responsável pelo relacionamento
// entre cargo, pessoa e filme
const cargoPessoaFilmeDAO =
require('../../model/DAO/pessoa/cargo_pessoa_filme.js')

/*
Função para criar um novo relacionamento
entre cargo, pessoa e filme
*/
const inserirNovoCargoPessoaFilme = async function(cargoPessoaFilme){

    // Cria uma cópia das mensagens para evitar alterações globais
    let customMessage =
        JSON.parse(JSON.stringify(configMessages))

    try {

        // Envia os dados para o DAO realizar o INSERT
        let result =
            await cargoPessoaFilmeDAO.insertCargoPessoaFilme(cargoPessoaFilme)

        // Verifica se o INSERT foi realizado
        if(result){

            // Adiciona o ID gerado ao objeto recebido
            cargoPessoaFilme.id = result

            // Monta a mensagem de sucesso
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

            // Erro retornado pelo Model/DAO
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        // Erro ocorrido na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

/*
Função para buscar todos os relacionamentos
de pessoas e cargos de um filme específico
*/
const buscarCargoPessoaIdFilme = async function(idFilme){

    let customMessage =
        JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca os registros pelo ID do filme
        let result =
            await cargoPessoaFilmeDAO.selectCargoPessoaByIdFilme(idFilme)

        // Verifica se o DAO retornou dados
        if(result){

            // Verifica se encontrou registros
            if(result.length > 0){

                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.cargo_pessoa_filme =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                // Nenhum relacionamento encontrado
                return customMessage.ERROR_NOT_FOUND
            }

        }else{

            // Erro ocorrido no DAO
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        // Erro ocorrido na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

/*
Função para excluir todos os relacionamentos
de pessoas e cargos de um filme
*/
const excluirCargoPessoaIdFilme = async function(idFilme){

    let customMessage =
        JSON.parse(JSON.stringify(configMessages))

    try {

        // Remove todos os relacionamentos
        // vinculados ao filme informado
        let result =
            await cargoPessoaFilmeDAO.deleteCargoPessoaByIdFilme(idFilme)

        // Verifica se a exclusão ocorreu
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