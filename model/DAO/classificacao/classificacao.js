/*
Objetivo: Arquivo responsável pelo CRUD de dados da classificação no banco de dados MySQL
Data: 15/05/2026
Autor: Leandro
Versão: 1.0
*/

// Import da biblioteca para manipular dados no banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)


// Função para inserir uma nova classificação no banco de dados
const InsertClassificacao = async function (classificacao) {
    
    try {

        // Script SQL responsável por inserir uma nova classificação na tabela tbl_classificacao
        let sql = `insert into tbl_classificacao (
            sigla,
            nome,
            descricao

        ) values (
            '${classificacao.sigla}',
            '${classificacao.nome}',
            '${classificacao.descricao}'
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


// Função para retornar todas as classificações cadastradas no banco de dados
const selectAllClassificacao = async function () {

    try {

        // Script SQL para listar todas as classificações cadastradas
        let sql = `select * from tbl_classificacao order by id desc;`

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de classificações
            return result[0]

        }else{

            return false

        }


    } catch (error) {

        return false

    }
    
}


// Função para retornar uma classificação específica filtrando pelo ID
const selectByIdClassificacao = async function (id) {

    try {

        // Script SQL para buscar uma classificação pelo identificador informado
        let sql = `select * from tbl_classificacao where id = ${id};`

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


// Função para atualizar uma classificação existente no banco de dados
const updateClassificacao = async function (classificacao) {

    try {

        // Script SQL responsável por atualizar os dados da classificação pelo ID
        let sql = `update tbl_classificacao set
                        sigla = '${classificacao.sigla}',
                        nome = '${classificacao.nome}',
                        descricao = '${classificacao.descricao}'
                    where id = ${classificacao.id};`

        // Executa o script SQL de atualização no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se a atualização foi realizada corretamente
        if(result){

            return true

        }else{

            return false

        }
        
    } catch (error) {

        return false

    }
    
}


// Função para excluir uma classificação filtrando pelo ID
const deleteClassificacao = async function (id) {

    try {

        // Script SQL responsável por excluir uma classificação pelo identificador
        let sql = `delete from tbl_classificacao where id =${id};`

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
    InsertClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    updateClassificacao,
    deleteClassificacao
}