/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de filme genero
Data: 22/05/2026
Autor: Leandro
Versão: 1.0
*/

const configMessages = require('../modulo/configMessages.js')

const pessoaNacionalidadeDAO = require('../../model/DAO/pessoa_nacionalidade/pessoa_nacionalidade.js')

//Inserir novo filmegenero ao DB
const inserirNovoPessoaNacionalidade = async function(pessoaNacionalidade){

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
            //Validando o argumento genero
            let validar = await validarDados(pessoaNacionalidade)

            //Se a validação apontar algo ela retorna oque ela apontou
            if(validar){
                return validar

                //Se a validação não apontou então ela fará:
            }else{

                //A tratativa e o insert do genero no DAO para o banco e o retorno sera guardado em result
                let result = await pessoaNacionalidadeDAO.insertPessoaNacionalidade(pessoaNacionalidade)

                //Se o retorno do result for o desejado:
                if(result){

                    //Cria o id no Json do filme e adiciona o id gerado no DAO
                    pessoaNacionalidade.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = pessoaNacionalidade

                    return customMessage.DEFAULT_MESSAGE //201
                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
    
}

//Lista os filmegeneros do DB
const listarPessoaNacionalidade = async function () {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Retorna a lista de generos do DB
        let result = await pessoaNacionalidadeDAO.selectAllPessoaNacionalidade()

        //Se o retorno for o esperado
        if(result){
            
            //Validamos se o retorno (objeto json) nos trouxe algo e se ele trouxe:
            if(result.length > 0){

                //mandamos mensagem de retorno
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade = result

                return customMessage.DEFAULT_MESSAGE //200

                //Caso ele não retorne oque queremos então
            }else{
                return configMessages.ERROR_NOT_FOUND //404
            }

        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Busca um filmegenero por um id 
const buscarPessoaNacionalidade = async function (id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(id == undefined || String(id).replaceAll(' ','') == "" || id == null || isNaN(id) || id <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await pessoaNacionalidadeDAO.selectByIdPessoaNacionalidade(id)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    //Se o genero não existir
                    return customMessage.ERROR_NOT_FOUND //404

                }

            }else{ 
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Busca o genero por um id de filme
const buscarNacionalidadeIdPessoa = async function (idPessoa) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(idPessoa == undefined || String(idPessoa).replaceAll(' ','') == "" || idPessoa == null || isNaN(idPessoa) || idPessoa <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID_FILME] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await pessoaNacionalidadeDAO.selectNacionalidadeByIdPessoa(idPessoa)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    //Se o genero não existir
                    return customMessage.ERROR_NOT_FOUND //404

                }

            }else{ 
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Busca o filme por um id de genero
const buscarPessoaIdNacionalidade = async function (idNacionalidade) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(idNacionalidade == undefined || String(idNacionalidade).replaceAll(' ','') == "" || idNacionalidade == null || isNaN(idNacionalidade) || idNacionalidade <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID_GENERO] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await pessoaNacionalidadeDAO.selectPessoaByIdNacionalidade(idNacionalidade)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.pessoa_nacionalidade = result

                    return customMessage.DEFAULT_MESSAGE

                }else{

                    //Se o genero não existir
                    return customMessage.ERROR_NOT_FOUND //404

                }

            }else{ 
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualizar um filmegenero
const atualizarPessoaNacionalidade = async function (pessoaNacionalidade, id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {      
            //Utilizamos a função de buscar genero pelo ID para referenciar o genero especifico que vamos mudar
            let resultBuscarId = await buscarPessoaNacionalidade(id)

            //Se o BuscarGenero nos retornar status true
            if(resultBuscarId.status){

                //Validamos os dados que serão inseridos no DB
                let validar = await validarDados(pessoaNacionalidade)

                //Se ele não cair na validação segue para
                if(!validar){
                    
                    //Atribuição do ID no Retorno
                    pessoaNacionalidade.id = Number(id)

                    //Atualizamos o desejado
                    let result = await pessoaNacionalidadeDAO.updatePessoaNacionalidade(pessoaNacionalidade)

                    //Se conseguirmos atualizar retornamos mensagem de sucesso
                    if(result){

                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = pessoaNacionalidade

                        return customMessage.DEFAULT_MESSAGE
                    }else{
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                }else{
                    
                    return validar //Se ele cair na validação o modulo da validação dira o erro

                }

            }else{

                return resultBuscarGenero //Retorno da mensagem virá do buscar genero

            }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Excluir filmGenero 
const excluirPessoaNacionalidade = async function (id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Chama a função de buscarGenero
        let resultBuscarId = await buscarPessoaNacionalidade(id)

        //Se o status do genero for true
        if(resultBuscarId.status){

            //Deletamos o genero do DB
            let result = await pessoaNacionalidadeDAO.deletePessoaNacionalidade(id)

            //Se a exclusão ocorrer corretamente retornamos uma mensagem de sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

                //Se a exclusãofalhar o erro foi na moedel
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{

            //Se algo der errado o responsavel (buscarGenero) nos dirá o erro
            return resultBuscarId
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Excluir a relação de generos com o filme 
const excluirNacionalidadeIdPessoa = async function (idPessoa) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Deletamos o genero do DB
        let result = await pessoaNacionalidadeDAO.deleteNacionalidadeByIdPessoa(idPessoa)

        //Se a exclusão ocorrer corretamente retornamos uma mensagem de sucesso
        if(result){
            
            return customMessage.SUCCESS_DELETED_ITEM

            //Se a exclusãofalhar o erro foi na moedel
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Valida dados do filmegenero
const validarDados = async function(pessoaNacionalidade){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(pessoaNacionalidade.id_pessoa == undefined || pessoaNacionalidade.id_pessoa == "" || pessoaNacionalidade.id_pessoa == null || pessoaNacionalidade.id_pessoa.length <= 0 || isNaN(pessoaNacionalidade.id_pessoa)){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_FILME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST 
    }else if(pessoaNacionalidade.id_nacionalidade == undefined || pessoaNacionalidade.id_nacionalidade == "" || pessoaNacionalidade.id_nacionalidade == null || pessoaNacionalidade.id_nacionalidade.length <= 0 || isNaN(pessoaNacionalidade.id_nacionalidade)){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_FILME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST 
    }else{
        return false
    }
}


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