/*
Objetivo: Arquivo responsável pelo CRUD de dados do gênero no banco de dados MySQL
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


// Função para inserir um novo gênero no banco de dados
const insertGenero = async function(genero){

    try {

        // Script SQL responsável por inserir um novo gênero na tabela tbl_genero
        let sql = `
        insert into tbl_genero (
                    nome
                    ) values (
                    '${genero.nome}'
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


// Função para retornar todos os gêneros cadastrados no banco de dados
const selectAllGenero = async function(){

    try {

        // Script SQL para listar todos os gêneros cadastrados
        let sql = 'select * from tbl_genero order by id desc;'

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        // ou um retorno falso em caso de erro
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de gêneros
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }
}


// Função para retornar um gênero específico filtrando pelo ID
const selectByIdGenero = async function(id){

    try {

        // Script SQL para buscar um gênero pelo identificador informado
        let sql = `select * from tbl_genero where id=${id};`

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


// Função para atualizar os dados de um gênero existente no banco de dados
const updateGenero = async function(genero){

    try {

        // Script SQL responsável por atualizar o gênero pelo ID informado
        let sql = `update tbl_genero set
                        nome = '${genero.nome}'
                    where id = ${genero.id};`

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


// Função para excluir um gênero filtrando pelo ID
const deleteGenero = async function(id){

    try {

        // Script SQL responsável por excluir um gênero pelo identificador
        let sql = `delete from tbl_genero where id =${id};`

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
    insertGenero,
    updateGenero,
    selectAllGenero,
    selectByIdGenero,
    deleteGenero
}