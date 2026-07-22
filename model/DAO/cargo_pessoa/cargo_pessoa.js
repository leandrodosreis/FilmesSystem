/*
Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL referente ao relacionamento cargo e pessoa
Data: 15/06/2026
Autor: Leandro
Versão: 1.0
*/

// Import da biblioteca para manipular dados no banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)


// Função para inserir dados na tabela de relacionamento cargo pessoa
const insertCargoPessoa = async function(cargoPessoa){

    try {

        // Script SQL responsável por inserir um relacionamento entre cargo e pessoa
        let sql = `
        insert into tbl_cargo_pessoa (
                    id_cargo,
                    id_pessoa
                    ) values (
                    ${cargoPessoa.id_cargo},
                    ${cargoPessoa.id_pessoa}
        );`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se a inserção foi realizada corretamente
        if(result){

            // Retorna o ID gerado pelo banco após o insert
            return result[0].insertId

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar todos os dados do relacionamento cargo pessoa
const selectAllCargoPessoa = async function(){

    try {

        // Script SQL para listar todos os relacionamentos entre cargos e pessoas
        let sql = 'select * from tbl_cargo_pessoa order by id desc;'

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        // ou um retorno falso em caso de erro
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de relacionamentos
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar um relacionamento cargo pessoa filtrando pelo ID
const selectByIdCargoPessoa = async function(id){

    try {

        // Script SQL para buscar um relacionamento pelo identificador informado
        let sql = `select * from tbl_cargo_pessoa where id=${id};`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna os dados encontrados
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar os cargos relacionados com uma pessoa pelo ID da pessoa
const selectCargosByIdPessoa = async function(idPessoa){

    try {

        // Script SQL para buscar os cargos vinculados a uma pessoa
        let sql = `
            select tbl_cargo.*
            from tbl_pessoa

                inner join tbl_cargo_pessoa
                    on tbl_pessoa.id = tbl_cargo_pessoa.id_pessoa

                inner join tbl_cargo
                    on tbl_cargo.id = tbl_cargo_pessoa.id_cargo

            where tbl_pessoa.id = ${idPessoa};
        `

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna os cargos encontrados
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar as pessoas relacionadas com um cargo pelo ID do cargo
const selectPessoasByIdCargo = async function(idCargo){

    try {

        // Script SQL para buscar as pessoas vinculadas a um cargo
        let sql = `
            select tbl_pessoa.*
            from tbl_pessoa

                inner join tbl_cargo_pessoa
                    on tbl_pessoa.id = tbl_cargo_pessoa.id_pessoa

                inner join tbl_cargo
                    on tbl_cargo.id = tbl_cargo_pessoa.id_cargo

            where tbl_cargo.id = ${idCargo};
        `

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna as pessoas encontradas
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para atualizar um relacionamento cargo pessoa existente
const updateCargoPessoa = async function(cargoPessoa){

    try {

        // Script SQL responsável por atualizar o relacionamento pelo ID informado
        let sql = `
            update tbl_cargo_pessoa set
                id_cargo = ${cargoPessoa.id_cargo},
                id_pessoa = ${cargoPessoa.id_pessoa}
            where id = ${cargoPessoa.id};
        `

        // Executa o script SQL de atualização no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o update foi realizado corretamente
        if(result){

            return true

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função responsável por excluir um relacionamento cargo pessoa
const deleteCargoPessoa = async function(id){

    try {

        // Script SQL responsável por excluir um relacionamento pelo identificador
        let sql = `delete from tbl_cargo_pessoa where id = ${id};`

        // Executa o script SQL de exclusão no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se a exclusão foi realizada corretamente
        if(result){

            return true

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função responsável por excluir os cargos relacionados com uma pessoa
// Obs: esta função será utilizada no PUT da pessoa
const deleteCargosByIdPessoa = async function(idPessoa){

    try {

        // Script SQL responsável por remover os cargos vinculados à pessoa
        let sql = `
            delete from tbl_cargo_pessoa
            where id_pessoa = ${idPessoa};
        `

        // Executa o script SQL de exclusão no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se a exclusão foi realizada corretamente
        if(result){

            return true

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Exporta as funções do DAO para serem utilizadas em outros arquivos
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