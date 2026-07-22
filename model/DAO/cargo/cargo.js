/*
Objetivo: Arquivo responsável pelo CRUD de dados do cargo no banco de dados MySQL
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


// Função para inserir um novo cargo no banco de dados
const insertCargo = async function(cargo){

    try {

        // Script SQL responsável por inserir um novo cargo na tabela tbl_cargo
        let sql = `
        insert into tbl_cargo (
                    funcao
                    ) values (
                    '${cargo.funcao}'
        );`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o cadastro foi realizado corretamente
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


// Função para retornar todos os cargos cadastrados no banco de dados
const selectAllCargo = async function(){

    try {

        // Script SQL para listar todos os cargos cadastrados
        let sql = 'select * from tbl_cargo order by id desc;'

        // Executa o script no banco e guarda o retorno dos dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        // ou um retorno falso em caso de erro
        if(Array.isArray(result)){

            // Retorna somente o índice que contém a lista de cargos
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }
}


// Função para retornar um cargo específico filtrando pelo ID
const selectByIdCargo = async function(id){

    try {

        // Script SQL para buscar um cargo pelo seu identificador
        let sql = `select * from tbl_cargo where id=${id};`

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


// Função para atualizar os dados de um cargo existente no banco de dados
const updateCargo = async function(cargo){

    try {

        // Script SQL responsável por alterar os dados do cargo pelo ID informado
        let sql = `update tbl_cargo set
                        funcao = '${cargo.funcao}'
                    where id = ${cargo.id};`

        // Executa o script de atualização no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o update foi executado corretamente
        if(result){

            return true

        }else{

            return false

        }

    } catch (error) {

        return false

    }
}


// Função para excluir um cargo filtrando pelo ID
const deleteCargo = async function(id){

    try {

        // Script SQL responsável por excluir um cargo pelo identificador
        let sql = `delete from tbl_cargo where id =${id};`

        // Executa o script de exclusão no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se a exclusão foi realizada
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
    insertCargo,
    updateCargo,
    selectAllCargo,
    selectByIdCargo,
    deleteCargo
}