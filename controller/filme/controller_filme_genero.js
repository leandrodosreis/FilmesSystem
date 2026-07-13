/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de filme genero
Data: 22/05/2026
Autor: Leandro
Versão: 1.0
*/

const configMessages = require('../modulo/configMessages.js')

const filmeGeneroDAO = require('../../model/DAO/filme_genero/filme_genero.js')

//Inserir novo filmegenero ao DB
const inserirNovoFilmeGenero = async function(filmeGenero){

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
            //Validando o argumento genero
            let validar = await validarDados(filmeGenero)

            //Se a validação apontar algo ela retorna oque ela apontou
            if(validar){
                return validar

                //Se a validação não apontou então ela fará:
            }else{

                //A tratativa e o insert do genero no DAO para o banco e o retorno sera guardado em result
                let result = await filmeGeneroDAO.insertFilmeGenero(filmeGenero)

                //Se o retorno do result for o desejado:
                if(result){

                    //Cria o id no Json do filme e adiciona o id gerado no DAO
                    filmeGenero.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = filmeGenero

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
const listarFilmeGenero = async function () {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Retorna a lista de generos do DB
        let result = await filmeGeneroDAO.selectAllFilmeGenero()

        //Se o retorno for o esperado
        if(result){
            
            //Validamos se o retorno (objeto json) nos trouxe algo e se ele trouxe:
            if(result.length > 0){

                //mandamos mensagem de retorno
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.filme_Genero = result

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
const buscarFilmeGenero = async function (id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(id == undefined || String(id).replaceAll(' ','') == "" || id == null || isNaN(id) || id <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await filmeGeneroDAO.selectByIdFilmeGenero(id)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.filme_genero = result

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
const buscarGenerosIdFilme = async function (idFilme) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(idFilme == undefined || String(idFilme).replaceAll(' ','') == "" || idFilme == null || isNaN(idFilme) || idFilme <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID_FILME] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await filmeGeneroDAO.selectGenerosByIdFilme(idFilme)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.filme_genero = result

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
const buscarFilmesIdGenero = async function (idGenero) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(idGenero == undefined || String(idGenero).replaceAll(' ','') == "" || idGenero == null || isNaN(idGenero) || idGenero <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID_GENERO] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await filmeGeneroDAO.selectFilmesByIdGenero(idGenero)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.filme_genero = result

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
const atualizarFilmeGenero = async function (filmeGenero, id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {      
            //Utilizamos a função de buscar genero pelo ID para referenciar o genero especifico que vamos mudar
            let resultBuscarId = await buscarFilmeGenero(id)

            //Se o BuscarGenero nos retornar status true
            if(resultBuscarId.status){

                //Validamos os dados que serão inseridos no DB
                let validar = await validarDados(filmeGenero)

                //Se ele não cair na validação segue para
                if(!validar){
                    
                    //Atribuição do ID no Retorno
                    filmeGenero.id = Number(id)

                    //Atualizamos o desejado
                    let result = await filmeGeneroDAO.updateFilmeGenero(filmeGenero)

                    //Se conseguirmos atualizar retornamos mensagem de sucesso
                    if(result){

                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = filmeGenero

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
const excluirFilmeGenero = async function (id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Chama a função de buscarGenero
        let resultBuscarId = await buscarFilmeGenero(id)

        //Se o status do genero for true
        if(resultBuscarId.status){

            //Deletamos o genero do DB
            let result = await filmeGeneroDAO.deleteFilmeGenero(id)

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
const excluirGenerosIdFilme = async function (idFilme) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Deletamos o genero do DB
        let result = await filmeGeneroDAO.deleteGenerosByIdFilme(idFilme)

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
const validarDados = async function(filmeGenero){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(filmeGenero.id_filme == undefined || filmeGenero.id_filme == "" || filmeGenero.id_filme == null || filmeGenero.id_filme.length <= 0 || isNaN(filmeGenero.id_filme)){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_FILME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST 
    }else if(filmeGenero.id_genero == undefined || filmeGenero.id_genero == "" || filmeGenero.id_genero == null || filmeGenero.id_genero.length <= 0 || isNaN(filmeGenero.id_genero)){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_FILME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST 
    }else{
        return false
    }
}


module.exports = {
    inserirNovoFilmeGenero,
    listarFilmeGenero,
    buscarFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    buscarGenerosIdFilme,
    buscarFilmesIdGenero,
    excluirGenerosIdFilme
}