/*
Objetivo: Arquivo responsavel pelo CRUD no banco de dados MySQL referente o relacionamento cargo e pessoa
Data: 15/06/2026
Autor: Leandro
Versão: 1.0
*/

const knex = require('knex')
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDatabaseConfig.development)

const insertCargoPessoa = async function(cargoPessoa){

    try {

        let sql = `
        insert into tbl_cargo_pessoa (
                    id_cargo,
                    id_pessoa
                    ) values (
                    ${cargoPessoa.id_cargo},
                    ${cargoPessoa.id_pessoa}
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

const selectAllCargoPessoa = async function(){

    try {

        let sql = 'select * from tbl_cargo_pessoa order by id desc;'

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

const selectByIdCargoPessoa = async function(id){

    try {

        let sql = `select * from tbl_cargo_pessoa where id=${id};`

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

const selectCargosByIdPessoa = async function(idPessoa){

    try {

        let sql = `
            select tbl_cargo.*
            from tbl_pessoa

                inner join tbl_cargo_pessoa
                    on tbl_pessoa.id = tbl_cargo_pessoa.id_pessoa

                inner join tbl_cargo
                    on tbl_cargo.id = tbl_cargo_pessoa.id_cargo

            where tbl_pessoa.id = ${idPessoa};
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

const selectPessoasByIdCargo = async function(idCargo){

    try {

        let sql = `
            select tbl_pessoa.*
            from tbl_pessoa

                inner join tbl_cargo_pessoa
                    on tbl_pessoa.id = tbl_cargo_pessoa.id_pessoa

                inner join tbl_cargo
                    on tbl_cargo.id = tbl_cargo_pessoa.id_cargo

            where tbl_cargo.id = ${idCargo};
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

const updateCargoPessoa = async function(cargoPessoa){

    try {

        let sql = `
            update tbl_cargo_pessoa set
                id_cargo = ${cargoPessoa.id_cargo},
                id_pessoa = ${cargoPessoa.id_pessoa}
            where id = ${cargoPessoa.id};
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

const deleteCargoPessoa = async function(id){

    try {

        let sql = `delete from tbl_cargo_pessoa where id = ${id};`

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

const deleteCargosByIdPessoa = async function(idPessoa){

    try {

        let sql = `
            delete from tbl_cargo_pessoa
            where id_pessoa = ${idPessoa};
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
    insertCargoPessoa,
    updateCargoPessoa,
    selectAllCargoPessoa,
    selectByIdCargoPessoa,
    deleteCargoPessoa,
    selectCargosByIdPessoa,
    selectPessoasByIdCargo,
    deleteCargosByIdPessoa
}