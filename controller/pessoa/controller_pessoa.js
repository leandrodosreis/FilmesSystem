/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de filme
Data: 17/04/2026
Autor: Leandro
Versão: 1.0
*/

//Import do arquivo de configurações de mensagens do projeto
const configMessages = require('../modulo/configMessages.js')

//Import do arquivo do DAO para manipular os dados de filme no banco de dados
const pessoaDAO = require('../../model/DAO/pessoa/pessoa.js')

//Import das Controllers
const controllerSexo = require('../sexo/controller_sexo.js')
const controllerPessoaNacionalidade = require('./controller_pessoa_nacionalidade.js')
const controllerCargoPessoa = require('./controller_cargo_pessoa.js')


// Função para inserir um novo filme 
const inserirNovoPessoa = async function(pessoa, contentType){

    //Cria uma copia dos JSON do arquivo de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
            
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função para validar a entrada de dados do filme
            let validar = await validarDados(pessoa)


            //Retorna um json de erro caso algum atributo seja invalido, senão retorna um false(Nâo teve erro)
            if(validar){
                return validar //400
            }
            else{
                //Encaminha os dados do filme para o DAO inserir no banco de dados
                let result = await pessoaDAO.insertPessoa(await tratarDados(pessoa))

                if(result){ //201
                    //Cria o id no Json do filme e adiciona o id gerado no DAO
                    pessoa.id = result

                    //Manipulação de dados para inserir os Generos relacionados ao filme
                    //Percorre o array de generos que chegara na requisição pelo objeto filme
                    for(itemNacionalidade of pessoa.nacionalidade){
                        let pessoaNacionalidade = {
                                    'id_pessoa' : pessoa.id,
                                    'id_nacionalidade' : itemNacionalidade.id
                        }

                        let resultPessoaNacionalidade = await controllerPessoaNacionalidade.inserirNovoPessoaNacionalidade(pessoaNacionalidade)
                        
                        //vALIDAÇÃO PARA VERIFICAR SE TODOS OS ITENS DE RELACIONAMENTO FORAM INSERIDOS
                        if(!resultPessoaNacionalidade.status){
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING //201 COM ALERT
                        }
                    }

                    for(itemCargo of pessoa.cargo){

                        let cargoPessoa = {
                            id_pessoa: pessoa.id,
                            id_cargo: itemCargo.id
                        }

                        let resultCargoPessoa =
                            await controllerCargoPessoa.inserirNovoCargoPessoa(cargoPessoa)

                        if(!resultCargoPessoa.status){
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = pessoa
                
                    return customMessage.DEFAULT_MESSAGE 
                }else{ //erro 500 (Model)
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    // customMessage.DEFAULT_MESSAGE.status = customMessage.ERROR_INTERNAL_SERVER_MODEL.status
                    // customMessage.DEFAULT_MESSAGE.status_code = customMessage.ERROR_INTERNAL_SERVER_MODEL.status_code
                    // customMessage.DEFAULT_MESSAGE.message = customMessage.ERROR_INTERNAL_SERVER_MODEL.message
                }

            }
        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (CONTROLLER)
    }

}

// Função para retornar todos os filmes
const listarPessoa = async function(){
    
    //Cria uma copia dos JSON do arquivo de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Chama a função do DAO para retornar a lista de filme do banco de dados
        let result = await pessoaDAO.selectAllPessoa()

        //Validação para verificar se o dao conseguiu processar o script no bd
        if(result){

            //Validação para verificar se o conteudo do arrray tem dados de 
            //retorno ou se esta vazio
            if(result.length > 0){

                //Manipulação dos dados da Classificação
                //Percorre o array de filmes 
                for (pessoa of result){
                    //Busca na controller da classificacao o ID referente a FK da classificacao
                    let resultSexo = await controllerSexo.buscarSexo(pessoa.id_sexo)

                    //Se encontrar o ID
                    if(resultSexo.status){
                        //Adicioa um atributo classificacao no JSON do filme e coloca o resultafo com os dados da classificacao
                        pessoa.sexo = resultSexo.response.sexo
                        //Apaga o id_classificacao do filme
                        delete pessoa.id_sexo
                    }

                    //Manipulação de dados para retornar os generos relacionados aos filmes
                    let resultNacionalidade = await controllerPessoaNacionalidade.buscarNacionalidadeIdPessoa(pessoa.id)

                    if(resultNacionalidade.status){
                        pessoa.nacionalidade = resultNacionalidade.response.pessoa_nacionalidade
                    }

                    let resultCargo = await controllerCargoPessoa.buscarCargoIdPessoa(pessoa.id)

                    if(resultCargo.status){
                        pessoa.cargo = resultCargo.response.cargo_pessoa
                    }

                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.pessoa = result

                return customMessage.DEFAULT_MESSAGE //200

            }else{
                return customMessage.ERROR_NOT_FOUND //404
            }

        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 (MODEL)
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (CONTROLLER)
    }
}

// Função para retornar um filme filtrando pelo ID
const buscarPessoa = async function(id){

    //Cria uma copia dos JSON do arquivo de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //validaçãopara garantir que o id seja um numero valido
        if(id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0){

            customMessage.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST //400 

        }else{

            //Chama a função do DAO para pesquisar filme pelo id
            let result = await pessoaDAO.selectByIdPessoa(id)

            //Validação para verificar se o DAO retornou dados ou um false
            if(result){

                //Validação para verificar se o DAO tem algum dado no Array
                if(result.length > 0){

                    //Manipulação dos dados da Classificação
                    //Percorre o array de filmes 
                    for (pessoa of result){
                        //Busca na controller da classificacao o ID referente a FK da classificacao
                        let resultSexo = await controllerSexo.buscarSexo(pessoa.id_sexo)

                        //Se encontrar o ID
                        if(resultSexo.status){
                            //Adicioa um atributo classificacao no JSON do filme e coloca o resultafo com os dados da classificacao
                            pessoa.sexo = resultSexo.response.sexo
                            //Apaga o id_classificacao do filme
                            delete pessoa.id_sexo
                        }

                         //Manipulação de dados para retornar os generos relacionados aos filmes
                    let resultNacionalidade = await controllerPessoaNacionalidade.buscarNacionalidadeIdPessoa(pessoa.id)

                    if(resultNacionalidade.status){
                        pessoa.nacionalidade = resultNacionalidade.response.pessoa_nacionalidade
                    }

                    let resultCargo = await controllerCargoPessoa.buscarCargoIdPessoa(pessoa.id)

                    if(resultCargo.status){
                        pessoa.cargo = resultCargo.response.cargo_pessoa
                    }

                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.pessoa = result

                    return customMessage.DEFAULT_MESSAGE //200 

                }else{
                    return customMessage.ERROR_NOT_FOUND //404
                }

            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 MODEL
            }

            //Esse else não precisa de Erros pois os anteriores ja fazem isso
            
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 CONTROLLER
    }
}

// Função para atualizar um filme
const atualizarPessoa = async function(pessoa, id, contentType){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        //Validação para verificar se o conteudo do body é um JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função para buscar filme e validar se o id esta correto,se o id existe no bd, e se o filme existe
            let resultBuscarPessoa = await buscarPessoa(id)

            if(resultBuscarPessoa.status){
                //Chama a função para validar os dados de alteração do filme
                let validar = await validarDados(await tratarDados(pessoa))

                if(!validar){

                    //Adiciona um atributo id no json de filme para enviar ao DAO um unico objeto
                    pessoa.id = Number(id)

                    //Chama a função para atualizar o filme no bd
                    let result = await pessoaDAO.updatePessoa(pessoa)

                    if(result){
                        
                        //Excluir as relações entre o filme e os generos (tabela de relação)
                        let resultDeleteNacionalidade = await controllerPessoaNacionalidade.excluirNacionalidadeIdPessoa(pessoa.id)

                        let resultDeleteCargo = await controllerCargoPessoa.excluirCargoIdPessoa(pessoa.id)

                        if(resultDeleteNacionalidade.status && resultDeleteCargo.status){

                            //Manipulação de dados para inserir os Generos relacionados ao filme
                            //Percorre o array de generos que chegara na requisição pelo objeto filme
                            for(itemNacionalidade of pessoa.nacionalidade){
                            let pessoaNacionalidade = {
                                        'id_pessoa' : pessoa.id,
                                        'id_nacionalidade' : itemNacionalidade.id
                            }

                            let resultPessoaNacionalidade = await controllerPessoaNacionalidade.inserirNovoPessoaNacionalidade(pessoaNacionalidade)
                            
                            //vALIDAÇÃO PARA VERIFICAR SE TODOS OS ITENS DE RELACIONAMENTO FORAM INSERIDOS
                            if(!resultPessoaNacionalidade.status){
                                return customMessage.SUCCESS_CREATED_ITEM_WARNING //201 COM ALERT
                            }
                            }

                            for(itemCargo of pessoa.cargo){

                                let cargoPessoa = {
                                    'id_pessoa': pessoa.id,
                                    'id_cargo': itemCargo.id
                                }

                                let resultCargoPessoa = await controllerCargoPessoa.inserirNovoCargoPessoa(cargoPessoa)

                                if(!resultCargoPessoa.status){
                                    return customMessage.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }


                        }

                        customMessage.DEFAULT_MESSAGE.status      = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message     = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response    = pessoa

                        return customMessage.DEFAULT_MESSAGE //200 atualizado
                    }else{
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 model
                    }

                }else{
                    return validar //400 validação dos campos do bd
                }

            }else{
                return resultBuscarPessoa //400(id invalido) ou 404(não encontrado) ou 500
            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 (Controller)
    }
}

// Função para excluir um filme
const excluirPessoa = async function(id){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let resultBuscarPessoa = await buscarPessoa(id)

        if(resultBuscarPessoa.status){

            let result = await pessoaDAO.deletePessoa(id)
            if(result){
                return customMessage.SUCCESS_DELETED_ITEM//204 ou 200

            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500 Model
            }

        }else{
            return resultBuscarPessoa //400 id invalido, 404 não encontrado ou 500 
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 CONTROLLER
    }
}

const validarDados = async function(pessoa){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(pessoa.nome == undefined || pessoa.nome == '' || pessoa.nome == null || pessoa.nome.length > 80){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else if(pessoa.data_nascimento == undefined || pessoa.data_nascimento == '' || pessoa.data_nascimento == null || pessoa.data_nascimento.length != 10){
        customMessage.ERROR_BAD_REQUEST.field = '[DATA DE LANÇAMENTO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else if(pessoa.filmografia == undefined || pessoa.filmografia == '' || pessoa.filmografia == null ){
        customMessage.ERROR_BAD_REQUEST.field = '[DURAÇÃO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    
    }else if(pessoa.biografia == undefined || pessoa.biografia == '' || pessoa.biografia == null ){
        customMessage.ERROR_BAD_REQUEST.field = '[DURAÇÃO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else if(pessoa.foto == undefined || pessoa.foto == '' || pessoa.foto == null || pessoa.foto.length > 255){
        customMessage.ERROR_BAD_REQUEST.field = '[CAPA] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else if(pessoa.id_sexo == undefined || isNaN(pessoa.id_sexo) || pessoa.id_sexo == null || pessoa.id_sexo == ""){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CLASSIFICACAO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST

    }else{
        return false
    }

}

const tratarDados = async function(pessoa) {
    //Tratamento para eliminar chegada de aspas como caracter invalido
    pessoa.nome            = pessoa.nome.replaceAll("'", "")
    pessoa.data_nascimento         = pessoa.data_nascimento.replaceAll("'", "")
    pessoa.filmografia            = pessoa.filmografia.replaceAll("'", "")
    pessoa.biografia = pessoa.biografia.replaceAll("'", "")
    pessoa.foto         = pessoa.foto.replaceAll("'", "")

    return pessoa
} 

module.exports = {
    inserirNovoPessoa,
    atualizarPessoa,
    listarPessoa,
    buscarPessoa,
    excluirPessoa
}