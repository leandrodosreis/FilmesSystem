/*
Objetivo: Arquivo responsavel pela validação, tratamento, manipulação de dados para realizar o CRUD de genero
Data: 17/04/2026
Autor: Leandro
Versão: 1.0
*/

const configMessages = require('../modulo/configMessages.js')

const generoDAO = require('../../model/DAO/genero/genero.js')

//Inserir novo genero ao DB
const inserirNovoGenero = async function(genero, contentType){

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        
        //Verificação do tipo de dados ou seja conferindo se é uma aplicação json (APLICATION/JSON) 
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
    
            //Validando o argumento genero
            let validar = await validarDados(genero)

            //Se a validação apontar algo ela retorna oque ela apontou
            if(validar){
                return validar

                //Se a validação não apontou então ela fará:
            }else{

                //A tratativa e o insert do genero no DAO para o banco e o retorno sera guardado em result
                let result = await generoDAO.insertGenero( await tratarDados(genero))

                //Se o retorno do result for o desejado:
                if(result){

                    //Cria o id no Json do filme e adiciona o id gerado no DAO
                    genero.id = result
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = genero

                    return customMessage.DEFAULT_MESSAGE //201
                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
            
        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
    
}

//Lista os generos do DB
const listarGenero = async function () {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        //Retorna a lista de generos do DB
        let result = await generoDAO.selectAllGenero()

        //Se o retorno for o esperado
        if(result){
            
            //Validamos se o retorno (objeto json) nos trouxe algo e se ele trouxe:
            if(result.length > 0){

                //mandamos mensagem de retorno
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.genero = result

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

//Busca o genero por um id 
const buscarGenero = async function (id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Validamos o id
        if(id == undefined || String(id).replaceAll(' ','') == "" || id == null || isNaN(id) || id <= 0 ){
            customMessage.ERROR_BAD_REQUEST.field = "[ID] INVALIDO"
            return customMessage.ERROR_BAD_REQUEST

        }else{

            //Se o id não cair na validação selecionamos ele no DB e atribuimos o retorno(genero) ao result
            let result = await generoDAO.selectByIdGenero(id)

            //Se result for verdadeiro 
            if(result){

                //validamos se ele trouxe o genero e retornamos mensagem com o conteudo 
                if(result.length > 0){

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                    customMessage.DEFAULT_MESSAGE.response.genero = result

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

//Atualizar um genero
const atualizarGenero = async function (genero, id, contentType) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Verificação do tipo de dados ou seja conferindo se é uma aplicação json (APLICATION/JSON) 
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            
            //Utilizamos a função de buscar genero pelo ID para referenciar o genero especifico que vamos mudar
            let resultBuscarGenero = await buscarGenero(id)

            //Se o BuscarGenero nos retornar status true
            if(resultBuscarGenero.status){

                //Validamos os dados que serão inseridos no DB
                let validar = await validarDados(await tratarDados(genero))

                //Se ele não cair na validação segue para
                if(!validar){
                    
                    //Atribuição do ID no Retorno
                    genero.id = Number(id)

                    //Atualizamos o desejado
                    let result = await generoDAO.updateGenero(genero)

                    //Se conseguirmos atualizar retornamos mensagem de sucesso
                    if(result){

                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = genero

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

        }else{
            return customMessage.ERROR_CONTENT_TYPE //415
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Excluir Genero 
const excluirGenero = async function (id) {

    //Cria uma copia das mensagens de resposta
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        //Chama a função de buscarGenero
        let resultBuscarGenero = await buscarGenero(id)

        //Se o status do genero for true
        if(resultBuscarGenero.status){

            //Deletamos o genero do DB
            let result = await generoDAO.deleteGenero(id)

            //Se a exclusão ocorrer corretamente retornamos uma mensagem de sucesso
            if(result){
                
                return customMessage.SUCCESS_DELETED_ITEM

                //Se a exclusãofalhar o erro foi na moedel
            }else{
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }

        }else{

            //Se algo der errado o responsavel (buscarGenero) nos dirá o erro
            return resultBuscarGenero
        }
        
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Valida dados do genero
const validarDados = async function(genero){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(genero.nome == undefined || genero.nome == "" || genero.nome == null || genero.nome.length > 40){
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST 
    }else{
        return false
    }
}

//trata aspas simples
const tratarDados = async function(genero) {
    genero.nome            = genero.nome.replaceAll("'", "")

    return genero
} 


module.exports = {
    inserirNovoGenero,
    atualizarGenero,
    listarGenero,
    buscarGenero,
    excluirGenero
}