/*
Objetivo: Arquivo responsável pelo CRUD de dados da nacionalidade no banco de dados MySQL
Data: 8/05/2026
Autor: Marcel
Versão: 1.0
*/

// Import da biblioteca para manipular dados no banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)


// Função para inserir uma nova nacionalidade no banco de dados
const insertNacionalidade = async function(nacionalidade){

    try {

        // Script SQL responsável por inserir uma nova nacionalidade na tabela tbl_nacionalidade
        let sql = `
        insert into tbl_nacionalidade (
                    nome
                    ) values (
                    '${nacionalidade.nome}'
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


// Função para retornar todas as nacionalidades cadastradas no banco de dados
const selectAllNacionalidade = async function(){

    try {

        // Script SQL para listar todas as nacionalidades cadastradas
        let sql = 'select * from tbl_nacionalidade order by id desc;'

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        // ou um retorno falso em caso de erro
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de nacionalidades
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }
}


// Função para retornar uma nacionalidade específica filtrando pelo ID
const selectByIdNacionalidade = async function(id){

    try {

        // Script SQL para buscar uma nacionalidade pelo identificador informado
        let sql = `select * from tbl_nacionalidade where id=${id};`

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


// Função para atualizar os dados de uma nacionalidade existente no banco de dados
const updateNacionalidade = async function(nacionalidade){

    try {

        // Script SQL responsável por atualizar a nacionalidade pelo ID informado
        let sql = `update tbl_nacionalidade set
                        nome = '${nacionalidade.nome}'
                    where id = ${nacionalidade.id};`

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


// Função para excluir uma nacionalidade filtrando pelo ID
const deleteNacionalidade = async function(id){

    try {

        // Script SQL responsável por excluir uma nacionalidade pelo identificador
        let sql = `delete from tbl_nacionalidade where id =${id};`

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
    insertNacionalidade,
    updateNacionalidade,
    deleteNacionalidade,
    selectAllNacionalidade,
    selectByIdNacionalidade
}