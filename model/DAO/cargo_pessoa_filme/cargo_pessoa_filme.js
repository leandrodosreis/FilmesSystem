/*
Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL referente ao relacionamento cargo pessoa e filme
Data: xx/xx/2026
Autor: Leandro
Versão: 1.0
*/

// Import da biblioteca para manipular dados no banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)


// Função para inserir dados na tabela de relacionamento cargo pessoa filme
const insertCargoPessoaFilme = async function(cargoPessoaFilme){

    try {

        // Script SQL responsável por inserir um relacionamento entre cargo pessoa e filme
        let sql = `
        insert into tbl_cargo_pessoa_filme (
                    id_filme,
                    id_cargo_pessoa
                    ) values (
                    ${cargoPessoaFilme.id_filme},
                    ${cargoPessoaFilme.id_cargo_pessoa}
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


// Função para retornar todos os dados do relacionamento cargo pessoa filme
const selectAllCargoPessoaFilme = async function(){

    try {

        // Script SQL para listar todos os relacionamentos entre cargo pessoa e filme
        let sql = 'select * from tbl_cargo_pessoa_filme order by id desc;'

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


// Função para retornar um relacionamento cargo pessoa filme filtrando pelo ID
const selectByIdCargoPessoaFilme = async function(id){

    try {

        // Script SQL para buscar um relacionamento pelo identificador informado
        let sql = `select * from tbl_cargo_pessoa_filme where id=${id};`

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


// Função para retornar os cargos e pessoas relacionados ao filme
const selectCargoPessoaByIdFilme = async function(idFilme){

    try {

        // Script SQL para buscar cargos e pessoas vinculados a um filme
        let sql = `
            select tbl_cargo_pessoa.*
            from tbl_filme

                inner join tbl_cargo_pessoa_filme
                    on tbl_filme.id = tbl_cargo_pessoa_filme.id_filme

                inner join tbl_cargo_pessoa
                    on tbl_cargo_pessoa.id = tbl_cargo_pessoa_filme.id_cargo_pessoa

            where tbl_filme.id = ${idFilme};
        `

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna os cargos e pessoas encontrados
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }
}


// Função para retornar os filmes relacionados ao cargo pessoa
const selectFilmesByIdCargoPessoa = async function(idCargoPessoa){

    try {

        // Script SQL para buscar filmes vinculados a um cargo e pessoa
        let sql = `
            select tbl_filme.*
            from tbl_filme

                inner join tbl_cargo_pessoa_filme
                    on tbl_filme.id = tbl_cargo_pessoa_filme.id_filme

                inner join tbl_cargo_pessoa
                    on tbl_cargo_pessoa.id = tbl_cargo_pessoa_filme.id_cargo_pessoa

            where tbl_cargo_pessoa.id = ${idCargoPessoa};
        `

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna os filmes encontrados
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }
}


// Função para atualizar um relacionamento cargo pessoa filme existente
const updateCargoPessoaFilme = async function(cargoPessoaFilme){

    try {

        // Script SQL responsável por atualizar o relacionamento pelo ID informado
        let sql = `
            update tbl_cargo_pessoa_filme set
                id_filme = ${cargoPessoaFilme.id_filme},
                id_cargo_pessoa = ${cargoPessoaFilme.id_cargo_pessoa}
            where id = ${cargoPessoaFilme.id};
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


// Função responsável por excluir um relacionamento cargo pessoa filme
const deleteCargoPessoaFilme = async function(id){

    try {

        // Script SQL responsável por excluir um relacionamento pelo identificador
        let sql = `delete from tbl_cargo_pessoa_filme where id = ${id};`

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


// Função responsável por excluir os relacionamentos de cargo pessoa vinculados a um filme
// Obs: esta função pode ser utilizada no PUT do filme
const deleteCargoPessoaByIdFilme = async function(idFilme){

    try {

        // Script SQL responsável por remover os relacionamentos vinculados ao filme
        let sql = `
            delete from tbl_cargo_pessoa_filme
            where id_filme = ${idFilme};
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
    insertCargoPessoaFilme,
    updateCargoPessoaFilme,
    selectAllCargoPessoaFilme,
    selectByIdCargoPessoaFilme,
    deleteCargoPessoaFilme,
    selectFilmesByIdCargoPessoa,
    selectCargoPessoaByIdFilme,
    deleteCargoPessoaByIdFilme
}