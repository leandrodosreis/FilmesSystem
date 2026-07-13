/*
Objetivo: Arquivo responsavel pelo CRUD de dados do filme no banco de dados MySQL
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

const insertGenero = async function(genero){

    try {

        let sql = `
        insert into tbl_genero (
                    nome
                    ) values (
                    '${genero.nome}'
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



const selectAllGenero = async function(){
        try {
        //Script sql para listar todos os generos
        let sql = 'select * from tbl_genero order by id desc;'

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

const selectByIdGenero = async function(id){
    try {
        let sql = `select * from tbl_genero where id=${id};`

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

const updateGenero = async function(genero){
    try {
        let sql = `update tbl_genero set
                        nome = '${genero.nome}'
                    where id = ${genero.id};`

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

const deleteGenero = async function(id){
    try {
        let sql = `delete from tbl_genero where id =${id};`

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
    insertGenero,
    updateGenero,
    selectAllGenero,
    selectByIdGenero,
    deleteGenero
}