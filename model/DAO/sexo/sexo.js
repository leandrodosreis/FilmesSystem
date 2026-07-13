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

const InsertSexo = async function (sexo) {
    
    try {
        
        let sql = `insert into tbl_sexo (
            sigla,
            nome

        ) values (
            '${sexo.sigla}',
            '${sexo.nome}'
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

const selectAllSexo = async function () {

    try {
        let sql = `select * from tbl_sexo order by id desc;`

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

const selectByIdSexo = async function (id) {

    try {
        
        let sql = `select * from tbl_sexo where id = ${id};`

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

const updateSexo = async function (sexo) {
    try {

        let sql = `update tbl_sexo set
                        sigla = '${sexo.sigla}',
                        nome = '${sexo.nome}'
                    where id = ${sexo.id};`

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

const deleteSexo = async function (id) {

    try {
        let sql = `delete from tbl_sexo where id =${id};`

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
    InsertSexo,
    selectAllSexo,
    selectByIdSexo,
    updateSexo,
    deleteSexo
}