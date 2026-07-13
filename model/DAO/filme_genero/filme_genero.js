/*
Objetivo: Arquivo responsavel pelo CRUD no banco de dados MySQL referente o relacionamento filme e genero
Data: 8/05/2026
Autor: Marcel
Versão: 1.0
*/

//Import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

//Função para inserir dados na tabela filme genero
const insertFilmeGenero = async function(filmeGenero){

    try {

        let sql = `
        insert into tbl_filme_genero (
                    id_filme,
                    id_genero
                    ) values (
                    ${filmeGenero.id_filme},
                    ${filmeGenero.id_genero}
        );`

        let result = await knexConection.raw(sql)

        if(result){
        return result[0].insertId
        }else{
            return false
        }

    } catch (error) {
        return false
    }
    
}

//Função para retornar todos os dados do filme genero
const selectAllFilmeGenero = async function(){
        try {
        //Script sql para listar todos os generos
        let sql = 'select * from tbl_filme_genero order by id desc;'

        //Executa no banco o script e guarda o retorno do banco
        //Pode ser um ERRO(false) ou um array com os dados
        let result = await knexConection.raw(sql)

        //Validação para verificar se o bd esta retornando
        //Array ou um Boolean (false)
        if(Array.isArray(result)){
            return result[0] //retorna somente o indice com a lista de genero
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

//Função para retornar os dados do filme genero por id
const selectByIdFilmeGenero = async function(id){
    try {
        let sql = `select * from tbl_filme_genero where id=${id};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){

            return result[0]
        
        }else{
        
            return false
        
        }

    } catch (error) {
        return false
    }
}

//Função para retornar os dados do genero filtrando pelo id do filme
const selectGenerosByIdFilme = async function(idFilme){
    try {
        let sql = `select tbl_genero.*
                        from tbl_filme
                            inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id_filme
                            inner join tbl_genero
                                on tbl_genero.id = tbl_filme_genero.id_genero

                            where tbl_filme.id=${idFilme};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){

            return result[0]
        
        }else{
        
            return false
        
        }

    } catch (error) {
        return false
    }
}

//Função para retornar os dados do genero filtrando pelo id do filme
const selectFilmesByIdGenero = async function(idGenero){
    try {
        let sql = `select tbl_filme.*
                        from tbl_filme
                            inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id_filme
                            inner join tbl_genero
                                on tbl_genero.id = tbl_filme_genero.id_genero
                                
                            where tbl_genero.id=${idGenero};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){

            return result[0]
        
        }else{
        
            return false
        
        }

    } catch (error) {
        return false
    }
}

//Função para atualizar um filme genero existente 
const updateFilmeGenero = async function(filmeGenero){
    try {
        let sql = `update tbl_filme_genero set
                        id_filme = ${filmeGenero.id_filme},
                        id_genero = ${filmeGenero.id_genero} 
                    where id = ${filmeGenero.id};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

//Função responsavel por excluir um filme genero
const deleteFilmeGenero = async function(id){
    try {
        let sql = `delete from tbl_filme_genero where id =${id};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

//Função responsavel por excluir os generos relacionados com um filme
//Obs: esta função sera utilizadad no put do filme
const deleteGenerosByIdFilme = async function(idFilme){
    try {
        let sql = `delete from tbl_filme_genero where id_filme =${idFilme};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

module.exports = {
    insertFilmeGenero,
    updateFilmeGenero,
    selectAllFilmeGenero,
    selectByIdFilmeGenero,
    deleteFilmeGenero,
    selectFilmesByIdGenero,
    selectGenerosByIdFilme,
    deleteGenerosByIdFilme
}