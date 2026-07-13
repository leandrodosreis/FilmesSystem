/*
Objetivo: Arquivo responsavel pelo CRUD de dados da classificacao no banco de dados MySQL
Data: 15/05/2026
Autor: Marcel
Versão: 1.0
*/

//Import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

const InsertClassificacao = async function (classificacao) {
    
    try {
        
        let sql = `insert into tbl_classificacao (
            sigla,
            nome,
            descricao

        ) values (
            '${classificacao.sigla}',
            '${classificacao.nome}',
            '${classificacao.descricao}'
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

const selectAllClassificacao = async function () {

    try {
        let sql = `select * from tbl_classificacao order by id desc;`

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

const selectByIdClassificacao = async function (id) {

    try {
        
        let sql = `select * from tbl_classificacao where id = ${id};`

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

const updateClassificacao = async function (classificacao) {
    try {

        let sql = `update tbl_classificacao set
                        sigla = '${classificacao.sigla}',
                        nome = '${classificacao.nome}',
                        descricao = '${classificacao.descricao}'
                    where id = ${classificacao.id};`

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

const deleteClassificacao = async function (id) {

    try {
        let sql = `delete from tbl_classificacao where id =${id};`

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
    InsertClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    updateClassificacao,
    deleteClassificacao
}