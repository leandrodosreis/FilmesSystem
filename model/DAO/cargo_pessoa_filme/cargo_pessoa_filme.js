/*
Objetivo: Arquivo responsavel pelo CRUD no banco de dados MySQL referente o relacionamento cargo pessoa e filme
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/

//Import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

//Função para inserir dados na tabela cargo pessoa filme
const insertCargoPessoaFilme = async function(cargoPessoaFilme){

    try {

        let sql = `
        insert into tbl_cargo_pessoa_filme (
                    id_filme,
                    id_cargo_pessoa
                    ) values (
                    ${cargoPessoaFilme.id_filme},
                    ${cargoPessoaFilme.id_cargo_pessoa}
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

//Função para retornar todos os dados do cargo pessoa filme
const selectAllCargoPessoaFilme = async function(){

    try {

        let sql = 'select * from tbl_cargo_pessoa_filme order by id desc;'

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

//Função para retornar os dados do cargo pessoa filme por id
const selectByIdCargoPessoaFilme = async function(id){

    try {

        let sql = `select * from tbl_cargo_pessoa_filme where id=${id};`

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

//Função para retornar os cargos/pessoas relacionados ao filme
const selectCargoPessoaByIdFilme = async function(idFilme){

    try {

        let sql = `
            select tbl_cargo_pessoa.*
            from tbl_filme

                inner join tbl_cargo_pessoa_filme
                    on tbl_filme.id = tbl_cargo_pessoa_filme.id_filme

                inner join tbl_cargo_pessoa
                    on tbl_cargo_pessoa.id = tbl_cargo_pessoa_filme.id_cargo_pessoa

            where tbl_filme.id = ${idFilme};
        `

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

//Função para retornar os filmes relacionados ao cargo pessoa
const selectFilmesByIdCargoPessoa = async function(idCargoPessoa){

    try {

        let sql = `
            select tbl_filme.*
            from tbl_filme

                inner join tbl_cargo_pessoa_filme
                    on tbl_filme.id = tbl_cargo_pessoa_filme.id_filme

                inner join tbl_cargo_pessoa
                    on tbl_cargo_pessoa.id = tbl_cargo_pessoa_filme.id_cargo_pessoa

            where tbl_cargo_pessoa.id = ${idCargoPessoa};
        `

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

//Função para atualizar um cargo pessoa filme existente
const updateCargoPessoaFilme = async function(cargoPessoaFilme){

    try {

        let sql = `
            update tbl_cargo_pessoa_filme set
                id_filme = ${cargoPessoaFilme.id_filme},
                id_cargo_pessoa = ${cargoPessoaFilme.id_cargo_pessoa}
            where id = ${cargoPessoaFilme.id};
        `

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

//Função responsavel por excluir um cargo pessoa filme
const deleteCargoPessoaFilme = async function(id){

    try {

        let sql = `delete from tbl_cargo_pessoa_filme where id = ${id};`

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

//Função responsavel por excluir os relacionamentos de um filme
const deleteCargoPessoaByIdFilme = async function(idFilme){

    try {

        let sql = `
            delete from tbl_cargo_pessoa_filme
            where id_filme = ${idFilme};
        `

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
    insertCargoPessoaFilme,
    updateCargoPessoaFilme,
    selectAllCargoPessoaFilme,
    selectByIdCargoPessoaFilme,
    deleteCargoPessoaFilme,
    selectFilmesByIdCargoPessoa,
    selectCargoPessoaByIdFilme,
    deleteCargoPessoaByIdFilme
}