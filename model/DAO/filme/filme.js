/*
Objetivo: Arquivo responsável pelo CRUD de dados do filme no banco de dados MySQL
Data: 15/04/2026
Autor: Marcel
Versão: 1.0
*/

// Import da biblioteca para manipular dados no banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)


// Função para inserir um novo filme no banco de dados
const insertFilme = async function(filme){

    try {

        // Script SQL responsável por inserir um novo filme na tabela tbl_filme
        let sql = `insert into tbl_filme (
            nome,
            sinopse,
            capa,
            data_lancamento,
            duracao,
            valor,
            avaliacao,
            id_classificacao
        ) values (
            '${filme.nome}',
            '${filme.sinopse}',
            '${filme.capa}',
            '${filme.data_lancamento}',
            '${filme.duracao}',
            '${filme.valor}',
            if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
            ${filme.id_classificacao}
        );`

        // Encaminha o script SQL para execução no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o insert foi realizado corretamente
        if(result){

            // Retorna o ID gerado pelo banco após a inserção
            return result[0].insertId

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar todos os dados dos filmes cadastrados no banco de dados
const selectAllFilme = async function(){

    try {

        // Script SQL responsável por listar todos os filmes cadastrados
        let sql = 'select * from tbl_filme order by id desc;'

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os filmes
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        // ou um retorno falso em caso de erro
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de filmes
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar um filme filtrando pelo ID
const selectByIdFilme = async function(id){

    try {

        // Script SQL responsável por buscar um filme pelo identificador informado
        let sql = `select * from tbl_filme where id=${id};`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna o filme encontrado
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para atualizar um filme existente no banco de dados
const updateFilme = async function(filme){

    try {

        // Script SQL responsável por atualizar os dados de um filme pelo ID
        let sql = `update tbl_filme set
                        nome                = '${filme.nome}',
                        sinopse             = '${filme.sinopse}',
                        capa                = '${filme.capa}',
                        data_lancamento     = '${filme.data_lancamento}',
                        duracao             = '${filme.duracao}',
                        valor               = '${filme.valor}',
                        avaliacao           = if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
                        id_classificacao    = ${filme.id_classificacao}
                    where id = ${filme.id};`

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


// Função responsável por excluir um filme filtrando pelo ID
const deleteFilme = async function(id){

    try {

        // Script SQL responsável por excluir um filme pelo identificador informado
        let sql = `delete from tbl_filme where id =${id};`

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
    insertFilme, 
    updateFilme, 
    selectAllFilme, 
    selectByIdFilme, 
    deleteFilme
}