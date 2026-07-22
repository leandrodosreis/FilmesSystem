/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de filme
Data: 17/04/2026
Autor: Leandro
Versão: 1.0
*/

// Import do arquivo de configurações de mensagens do projeto
const configMessages = require('../modulo/configMessages.js')

// Import do arquivo DAO responsável pelas operações de pessoa no banco de dados
const pessoaDAO = require('../../model/DAO/pessoa/pessoa.js')

// Import das controllers responsáveis pelos relacionamentos
const controllerSexo = require('../sexo/controller_sexo.js')
const controllerPessoaNacionalidade = require('./controller_pessoa_nacionalidade.js')
const controllerCargoPessoa = require('./controller_cargo_pessoa.js')


// Função responsável por inserir uma nova pessoa
const inserirNovoPessoa = async function(pessoa, contentType){

    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se o Content-Type da requisição é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Valida os dados recebidos
            let validar = await validarDados(pessoa)

            // Caso exista erro de validação retorna a mensagem correspondente
            if(validar){

                return validar //400

            }else{

                // Realiza o tratamento dos dados e envia para o DAO efetuar o insert
                let result = await pessoaDAO.insertPessoa(
                    await tratarDados(pessoa)
                )

                // Verifica se a inserção ocorreu com sucesso
                if(result){

                    // Adiciona ao objeto o ID gerado pelo banco
                    pessoa.id = result

                    // RELACIONAMENTO PESSOA x NACIONALIDADE

                    // Percorre todas as nacionalidades enviadas no objeto pessoa
                    for(itemNacionalidade of pessoa.nacionalidade){

                        // Monta o objeto de relacionamento
                        let pessoaNacionalidade = {
                            'id_pessoa' : pessoa.id,
                            'id_nacionalidade' : itemNacionalidade.id
                        }

                        // Insere o relacionamento na tabela intermediária
                        let resultPessoaNacionalidade =
                            await controllerPessoaNacionalidade.inserirNovoPessoaNacionalidade(
                                pessoaNacionalidade
                            )

                        // Verifica se o relacionamento foi criado corretamente
                        if(!resultPessoaNacionalidade.status){

                            // Pessoa criada, porém houve falha em algum relacionamento
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    // RELACIONAMENTO PESSOA x CARGO

                    // Percorre todos os cargos enviados no objeto pessoa
                    for(itemCargo of pessoa.cargo){

                        // Monta o objeto de relacionamento
                        let cargoPessoa = {
                            id_pessoa: pessoa.id,
                            id_cargo: itemCargo.id
                        }

                        // Insere o relacionamento na tabela intermediária
                        let resultCargoPessoa =
                            await controllerCargoPessoa.inserirNovoCargoPessoa(
                                cargoPessoa
                            )

                        // Verifica se o relacionamento foi criado corretamente
                        if(!resultCargoPessoa.status){

                            // Pessoa criada, porém houve falha em algum relacionamento
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    // Monta a resposta de sucesso
                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_CREATED_ITEM.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_CREATED_ITEM.status_code

                    customMessage.DEFAULT_MESSAGE.message =
                        customMessage.SUCCESS_CREATED_ITEM.message

                    customMessage.DEFAULT_MESSAGE.response = pessoa

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
        return console.log(error)
    }

}

// Função responsável por retornar todas as pessoas cadastradas
const listarPessoa = async function(){
    
    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Busca todas as pessoas cadastradas no banco de dados
        let result = await pessoaDAO.selectAllPessoa()

        // Verifica se o DAO conseguiu executar a consulta
        if(result){

            // Verifica se existem registros retornados
            if(result.length > 0){

                // MANIPULAÇÃO DOS RELACIONAMENTOS

                // Percorre todas as pessoas encontradas
                for (pessoa of result){

                    // RELACIONAMENTO COM SEXO

                    // Busca os dados completos do sexo utilizando a FK
                    let resultSexo = await controllerSexo.buscarSexo(
                        pessoa.id_sexo
                    )

                    // Caso encontre o sexo relacionado
                    if(resultSexo.status){

                        // Adiciona o objeto sexo na resposta
                        pessoa.sexo = resultSexo.response.sexo

                        // Remove a FK da resposta final
                        delete pessoa.id_sexo
                    }

                    // RELACIONAMENTO COM NACIONALIDADE

                    // Busca todas as nacionalidades relacionadas à pessoa
                    let resultNacionalidade =
                        await controllerPessoaNacionalidade.buscarNacionalidadeIdPessoa(
                            pessoa.id
                        )

                    // Caso existam nacionalidades relacionadas
                    if(resultNacionalidade.status){

                        pessoa.nacionalidade =
                            resultNacionalidade.response.pessoa_nacionalidade
                    }

                    // RELACIONAMENTO COM CARGO

                    // Busca todos os cargos relacionados à pessoa
                    let resultCargo =
                        await controllerCargoPessoa.buscarCargoIdPessoa(
                            pessoa.id
                        )

                    // Caso existam cargos relacionados
                    if(resultCargo.status){

                        pessoa.cargo =
                            resultCargo.response.cargo_pessoa
                    }

                }

                // Monta a resposta de sucesso
                customMessage.DEFAULT_MESSAGE.status =
                    customMessage.SUCCESS_RESPONSE.status

                customMessage.DEFAULT_MESSAGE.status_code =
                    customMessage.SUCCESS_RESPONSE.status_code

                customMessage.DEFAULT_MESSAGE.response.count =
                    result.length

                customMessage.DEFAULT_MESSAGE.response.pessoa =
                    result

                return customMessage.DEFAULT_MESSAGE

            }else{

                // Nenhuma pessoa encontrada
                return customMessage.ERROR_NOT_FOUND
            }

        }else{

            // Erro ocorrido na camada Model
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
        
    } catch (error) {

        // Erro inesperado na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função responsável por buscar uma pessoa através do ID
const buscarPessoa = async function(id){

    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Validação do ID informado
        if(
            id == undefined ||
            String(id).replaceAll(' ', '') == '' ||
            id == null ||
            isNaN(id) ||
            id <= 0
        ){

            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'

            return customMessage.ERROR_BAD_REQUEST

        }else{

            // Busca a pessoa correspondente ao ID informado
            let result = await pessoaDAO.selectByIdPessoa(id)

            // Verifica se o DAO conseguiu executar a consulta
            if(result){

                // Verifica se a pessoa foi encontrada
                if(result.length > 0){

                    // MANIPULAÇÃO DOS RELACIONAMENTOS

                    // Percorre o resultado encontrado
                    for (pessoa of result){

                        // RELACIONAMENTO COM SEXO

                        // Busca os dados completos do sexo
                        let resultSexo = await controllerSexo.buscarSexo(
                            pessoa.id_sexo
                        )

                        // Caso encontre o sexo relacionado
                        if(resultSexo.status){

                            // Adiciona o objeto sexo ao JSON de retorno
                            pessoa.sexo = resultSexo.response.sexo

                            // Remove a FK da resposta
                            delete pessoa.id_sexo
                        }

                        // RELACIONAMENTO COM NACIONALIDADE

                        let resultNacionalidade =
                            await controllerPessoaNacionalidade.buscarNacionalidadeIdPessoa(
                                pessoa.id
                            )

                        if(resultNacionalidade.status){

                            pessoa.nacionalidade =
                                resultNacionalidade.response.pessoa_nacionalidade
                        }

                        // RELACIONAMENTO COM CARGO

                        let resultCargo =
                            await controllerCargoPessoa.buscarCargoIdPessoa(
                                pessoa.id
                            )

                        if(resultCargo.status){

                            pessoa.cargo =
                                resultCargo.response.cargo_pessoa
                        }

                    }

                    // Monta a resposta de sucesso
                    customMessage.DEFAULT_MESSAGE.status =
                        customMessage.SUCCESS_RESPONSE.status

                    customMessage.DEFAULT_MESSAGE.status_code =
                        customMessage.SUCCESS_RESPONSE.status_code

                    customMessage.DEFAULT_MESSAGE.response.pessoa =
                        result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    // Pessoa não encontrada
                    return customMessage.ERROR_NOT_FOUND
                }

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

// Função responsável por atualizar uma pessoa existente
const atualizarPessoa = async function(pessoa, id, contentType){

    // Cria uma cópia das mensagens padrão para evitar alterações no objeto original
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        // Verifica se o Content-Type da requisição é JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Verifica se a pessoa existe e se o ID informado é válido
            let resultBuscarPessoa = await buscarPessoa(id)

            if(resultBuscarPessoa.status){

                // Valida os dados recebidos para atualização
                let validar = await validarDados(
                    await tratarDados(pessoa)
                )

                if(!validar){

                    // Adiciona o ID ao objeto para envio ao DAO
                    pessoa.id = Number(id)

                    // Solicita ao DAO a atualização dos dados da pessoa
                    let result = await pessoaDAO.updatePessoa(pessoa)

                    if(result){

                        // REMOÇÃO DOS RELACIONAMENTOS ANTIGOS

                        // Remove todos os relacionamentos de nacionalidade
                        let resultDeleteNacionalidade =
                            await controllerPessoaNacionalidade.excluirNacionalidadeIdPessoa(
                                pessoa.id
                            )

                        // Remove todos os relacionamentos de cargo
                        let resultDeleteCargo =
                            await controllerCargoPessoa.excluirCargoIdPessoa(
                                pessoa.id
                            )

                        // Verifica se ambas as exclusões ocorreram corretamente
                        if(
                            resultDeleteNacionalidade.status &&
                            resultDeleteCargo.status
                        ){

                            // REINSERÇÃO DOS RELACIONAMENTOS DE NACIONALIDADE

                            // Percorre as nacionalidades enviadas na requisição
                            for(itemNacionalidade of pessoa.nacionalidade){

                                let pessoaNacionalidade = {
                                    'id_pessoa' : pessoa.id,
                                    'id_nacionalidade' : itemNacionalidade.id
                                }

                                // Cria novamente o relacionamento
                                let resultPessoaNacionalidade =
                                    await controllerPessoaNacionalidade.inserirNovoPessoaNacionalidade(
                                        pessoaNacionalidade
                                    )

                                // Verifica se o relacionamento foi criado
                                if(!resultPessoaNacionalidade.status){

                                    return customMessage.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }

                            // REINSERÇÃO DOS RELACIONAMENTOS DE CARGO

                            // Percorre os cargos enviados na requisição
                            for(itemCargo of pessoa.cargo){

                                let cargoPessoa = {
                                    'id_pessoa': pessoa.id,
                                    'id_cargo': itemCargo.id
                                }

                                // Cria novamente o relacionamento
                                let resultCargoPessoa =
                                    await controllerCargoPessoa.inserirNovoCargoPessoa(
                                        cargoPessoa
                                    )

                                // Verifica se o relacionamento foi criado
                                if(!resultCargoPessoa.status){

                                    return customMessage.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }

                        }

                        // Monta a resposta de sucesso
                        customMessage.DEFAULT_MESSAGE.status =
                            customMessage.SUCCESS_UPDATED_ITEM.status

                        customMessage.DEFAULT_MESSAGE.status_code =
                            customMessage.SUCCESS_UPDATED_ITEM.status_code

                        customMessage.DEFAULT_MESSAGE.message =
                            customMessage.SUCCESS_UPDATED_ITEM.message

                        customMessage.DEFAULT_MESSAGE.response =
                            pessoa

                        return customMessage.DEFAULT_MESSAGE

                    }else{

                        // Erro ocorrido na camada Model
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }

                }else{

                    // Retorna o erro encontrado durante a validação
                    return validar
                }

            }else{

                // Retorna o erro informado pela função buscarPessoa
                return resultBuscarPessoa
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

// Função responsável por excluir uma pessoa
const excluirPessoa = async function(id){

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Verifica se a pessoa existe antes da exclusão
        let resultBuscarPessoa = await buscarPessoa(id)

        if(resultBuscarPessoa.status){

            // Solicita ao DAO a exclusão da pessoa
            let result = await pessoaDAO.deletePessoa(id)

            // Exclusão realizada com sucesso
            if(result){

                return customMessage.SUCCESS_DELETED_ITEM

            }else{

                // Erro ocorrido na camada Model
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{

            // Retorna o erro informado pela função buscarPessoa
            return resultBuscarPessoa
        }

    } catch (error) {

        // Erro inesperado na Controller
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função responsável por validar os dados obrigatórios da pessoa
const validarDados = async function(pessoa){

    // Cria uma cópia das mensagens padrão
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(
        pessoa.nome == undefined ||
        pessoa.nome == '' ||
        pessoa.nome == null ||
        pessoa.nome.length > 80
    ){

        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    }else if(
        pessoa.data_nascimento == undefined ||
        pessoa.data_nascimento == '' ||
        pessoa.data_nascimento == null ||
        pessoa.data_nascimento.length != 10
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[DATA DE LANÇAMENTO] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST


    }else if(
        pessoa.filmografia == undefined ||
        pessoa.filmografia == '' ||
        pessoa.filmografia == null
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[DURAÇÃO] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST


    }else if(
        pessoa.biografia == undefined ||
        pessoa.biografia == '' ||
        pessoa.biografia == null
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[DURAÇÃO] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST


    }else if(
        pessoa.foto == undefined ||
        pessoa.foto == '' ||
        pessoa.foto == null ||
        pessoa.foto.length > 255
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[CAPA] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST


    }else if(
        pessoa.id_sexo == undefined ||
        isNaN(pessoa.id_sexo) ||
        pessoa.id_sexo == null ||
        pessoa.id_sexo == ""
    ){

        customMessage.ERROR_BAD_REQUEST.field =
            '[ID_CLASSIFICACAO] INVALIDO'

        return customMessage.ERROR_BAD_REQUEST

    }else{

        // Retorna false indicando que não houve erros de validação
        return false
    }

}

module.exports = {
    inserirNovoPessoa,
    atualizarPessoa,
    excluirPessoa,
    buscarPessoa,
    listarPessoa
}