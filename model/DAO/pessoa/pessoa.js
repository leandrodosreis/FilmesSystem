/*
Objetivo: Arquivo responsável pelo CRUD de dados da pessoa no banco de dados MySQL
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


// Função para inserir uma nova pessoa no banco de dados
const insertPessoa = async function(pessoa){

    try {

        // Script SQL responsável por inserir uma nova pessoa na tabela tbl_pessoa
        let sql = `insert into tbl_pessoa (
            nome,
            data_nascimento,
            filmografia,
            biografia,
            foto,
            id_sexo
        ) values (
            '${pessoa.nome}',
            '${pessoa.data_nascimento}',
            '${pessoa.filmografia}',
            '${pessoa.biografia}',
            '${pessoa.foto}',
            '${pessoa.id_sexo}'
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


// Função para retornar todas as pessoas cadastradas no banco de dados
const selectAllPessoa = async function(){

    try {

        // Script SQL para listar todas as pessoas cadastradas
        let sql = 'select * from tbl_pessoa order by id desc;'

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        // ou um retorno falso em caso de erro
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de pessoas
            return result[0]

        }else{

            return false

        }

    } catch (error) {

        return false

    }

}


// Função para retornar uma pessoa específica filtrando pelo ID
const selectByIdPessoa = async function(id){

    try {

        // Script SQL para buscar uma pessoa pelo identificador informado
        let sql = `select * from tbl_pessoa where id=${id};`

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


// Função para atualizar os dados de uma pessoa existente no banco de dados
const updatePessoa = async function(pessoa){

    try {

        // Script SQL responsável por atualizar os dados da pessoa pelo ID informado
        let sql = `update tbl_pessoa set
                        nome                = '${pessoa.nome}',
                        data_nascimento     = '${pessoa.data_nascimento}',
                        filmografia         = '${pessoa.filmografia}',
                        biografia           = '${pessoa.biografia}',
                        foto                = '${pessoa.foto}',
                        id_sexo             = '${pessoa.id_sexo}'
                    where id = ${pessoa.id};`

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


// Função para excluir uma pessoa filtrando pelo ID
const deletePessoa = async function(id){

    try {

        // Script SQL responsável por excluir uma pessoa pelo identificador
        let sql = `delete from tbl_pessoa where id =${id};`

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
    insertPessoa, 
    updatePessoa, 
    selectAllPessoa, 
    selectByIdPessoa, 
    deletePessoa
}