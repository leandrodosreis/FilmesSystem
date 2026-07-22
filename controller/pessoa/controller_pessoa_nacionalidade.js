/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de filme genero
Data: 22/05/2026
Autor: Leandro
Versão: 1.0
*/

// Import do arquivo de mensagens padronizadas
const configMessages = require('../modulo/configMessages.js')

// Import do DAO responsável pelas operações da tabela pessoa_nacionalidade
const pessoaNacionalidadeDAO = require('../../model/DAO/pessoa_nacionalidade/pessoa_nacionalidade.js')


// Função responsável por criar um novo relacionamento entre pessoa e nacionalidade
const inserirNovoPessoaNacionalidade = async function(pessoaNacionalidade){

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Valida os dados recebidos
        let validar = await validarDados(pessoaNacionalidade)

        // Se houver erro de validação retorna o erro
        if(validar){

            return validar

        }else{

            // Insere o relacionamento no banco de dados
            let result =
                await pessoaNacionalidadeDAO.insertPessoaNacionalidade(
                    pessoaNacionalidade
                )

            // Verifica se a inserção ocorreu com sucesso
            if(result){

                // Adiciona o ID gerado pelo banco
                pessoaNacionalidade.id = result

                // Monta a resposta de sucesso
                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_CREATED_ITEM.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_CREATED_ITEM.status_code

                customMessage.DEFAULT_MESSAGE.message =
                    customMessage.SUCCESS_CREATED_ITEM.message

                customMessage.DEFAULT_MESSAGE.response =
                    pessoaNacionalidade

                return customMessage.DEFAULT_MESSAGE

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {

        // Erro inesperado na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


// Função responsável por listar todos os relacionamentos pessoa_nacionalidade
const listarPessoaNacionalidade = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todos os relacionamentos cadastrados
        let result =
            await pessoaNacionalidadeDAO.selectAllPessoaNacionalidade()

        if(result){

            if(result.length > 0){

                // Monta a resposta de sucesso
                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.count =
                    result.length

                customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                // Nenhum relacionamento encontrado
                return configMessages.ERROR_NOT_FOUND
            }

        }else{

            // Erro ocorrido na Model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


// Função responsável por buscar um relacionamento pelo ID
const buscarPessoaNacionalidade = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID
        if(
            id == undefined ||
            String(id).replaceAll(' ','') == "" ||
            id == null ||
            isNaN(id) ||
            id <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field =
                "[ID] INVALIDO"

            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Busca o relacionamento pelo ID
            let result =
                await pessoaNacionalidadeDAO.selectByIdPessoaNacionalidade(id)

            if(result){

                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade =
                        result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    return customMessage.ERROR_NOT_FOUND
                }

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// Função responsável por buscar nacionalidades através do ID da pessoa
const buscarNacionalidadeIdPessoa = async function (idPessoa) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID da pessoa
        if(
            idPessoa == undefined ||
            String(idPessoa).replaceAll(' ','') == "" ||
            idPessoa == null ||
            isNaN(idPessoa) ||
            idPessoa <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field =
                "[ID_FILME] INVALIDO"

            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Busca as nacionalidades vinculadas à pessoa
            let result =
                await pessoaNacionalidadeDAO.selectNacionalidadeByIdPessoa(
                    idPessoa
                )

            if(result){

                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade =
                        result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    return customMessage.ERROR_NOT_FOUND
                }

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// Função responsável por buscar pessoas através do ID da nacionalidade
const buscarPessoaIdNacionalidade = async function (idNacionalidade) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID da nacionalidade
        if(
            idNacionalidade == undefined ||
            String(idNacionalidade).replaceAll(' ','') == "" ||
            idNacionalidade == null ||
            isNaN(idNacionalidade) ||
            idNacionalidade <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field =
                "[ID_GENERO] INVALIDO"

            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Busca as pessoas vinculadas à nacionalidade
            let result =
                await pessoaNacionalidadeDAO.selectPessoaByIdNacionalidade(
                    idNacionalidade
                )

            if(result){

                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade =
                        result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    return customMessage.ERROR_NOT_FOUND
                }

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// Função responsável por atualizar um relacionamento pessoa_nacionalidade
const atualizarPessoaNacionalidade = async function (pessoaNacionalidade, id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o relacionamento existe
        let resultBuscarId =
            await buscarPessoaNacionalidade(id)

        if(resultBuscarId.status){

            // Valida os novos dados
            let validar =
                await validarDados(pessoaNacionalidade)

            if(!validar){

                // Adiciona o ID ao objeto
                pessoaNacionalidade.id = Number(id)

                // Atualiza o relacionamento
                let result =
                    await pessoaNacionalidadeDAO.updatePessoaNacionalidade(
                        pessoaNacionalidade
                    )

                if(result){

                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_UPDATED_ITEM.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_UPDATED_ITEM.status_code

                    customMessage.DEFAULT_MESSAGE.message =
                        customMessage.SUCCESS_UPDATED_ITEM.message

                    customMessage.DEFAULT_MESSAGE.response =
                        pessoaNacionalidade

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

            }else{

                return validar
            }

        }else{

            return resultBuscarGenero
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// Função responsável por excluir um relacionamento pelo ID
const excluirPessoaNacionalidade = async function (id) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o relacionamento existe
        let resultBuscarId =
            await buscarPessoaNacionalidade(id)

        if(resultBuscarId.status){

            // Remove o relacionamento
            let result =
                await pessoaNacionalidadeDAO.deletePessoaNacionalidade(id)

            if(result){

                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{

            return resultBuscarId
        }

    } catch (error) {

        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// Função responsável por excluir todas as nacionalidades vinculadas a uma pessoa
const excluirNacionalidadeIdPessoa = async function (idPessoa) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Remove todos os relacionamentos da pessoa
        let result =
            await pessoaNacionalidadeDAO.deleteNacionalidadeByIdPessoa(
                idPessoa
            )

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
const validarDados = async function(pessoaNacionalidade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    // Validação do ID da pessoa
    if(
        pessoaNacionalidade.id_pessoa == undefined ||
        pessoaNacionalidade.id_pessoa == "" ||
        pessoaNacionalidade.id_pessoa == null ||
        pessoaNacionalidade.id_pessoa.length <= 0 ||
        isNaN(pessoaNacionalidade.id_pessoa)
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[ID_FILME] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    // Validação do ID da nacionalidade
    }else if(
        pessoaNacionalidade.id_nacionalidade == undefined ||
        pessoaNacionalidade.id_nacionalidade == "" ||
        pessoaNacionalidade.id_nacionalidade == null ||
        pessoaNacionalidade.id_nacionalidade.length <= 0 ||
        isNaN(pessoaNacionalidade.id_nacionalidade)
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[ID_FILME] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    }else{

        return false
    }
}


// Exportação das funções da controller
module.exports = {
    inserirNovoPessoaNacionalidade,
    listarPessoaNacionalidade,
    buscarPessoaNacionalidade,
    atualizarPessoaNacionalidade,
    excluirPessoaNacionalidade,
    buscarNacionalidadeIdPessoa,
    buscarPessoaIdNacionalidade,
    excluirNacionalidadeIdPessoa
}