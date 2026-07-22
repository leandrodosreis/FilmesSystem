/*
Objetivo: Arquivo responsável pelo CRUD de dados do sexo no banco de dados MySQL
Data: 15/05/2026
Autor: Marcel
Versão: 1.0
*/

// Import da biblioteca para manipular dados no banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD MySQL conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)


// Função para inserir um novo sexo no banco de dados
const InsertSexo = async function (sexo) {
    
    try {

        // Script SQL responsável por inserir um novo sexo na tabela tbl_sexo
        let sql = `insert into tbl_sexo (
            sigla,
            nome

        ) values (
            '${sexo.sigla}',
            '${sexo.nome}'
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


// Função para retornar todos os sexos cadastrados no banco de dados
const selectAllSexo = async function () {

    try {

        // Script SQL para listar todos os sexos cadastrados
        let sql = `select * from tbl_sexo order by id desc;`

        // Executa o script SQL e guarda o retorno do banco de dados
        // Pode retornar um erro(false) ou um array contendo os registros
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou um array válido
        if(Array.isArray(result)){

            // Retorna somente o índice contendo a lista de sexos
            return result[0]

        }else{

            return false

        }


    } catch (error) {

        return false

    }
    
}


// Função para retornar um sexo específico filtrando pelo ID
const selectByIdSexo = async function (id) {

    try {

        // Script SQL para buscar um sexo pelo identificador informado
        let sql = `select * from tbl_sexo where id = ${id};`

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


// Função para atualizar os dados de um sexo existente no banco de dados
const updateSexo = async function (sexo) {

    try {

        // Script SQL responsável por atualizar os dados do sexo pelo ID informado
        let sql = `update tbl_sexo set
                        sigla = '${sexo.sigla}',
                        nome = '${sexo.nome}'
                    where id = ${sexo.id};`

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


// Função para excluir um sexo filtrando pelo ID
const deleteSexo = async function (id) {

    try {

        // Script SQL responsável por excluir um sexo pelo identificador
        let sql = `delete from tbl_sexo where id =${id};`

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
    InsertSexo,
    selectAllSexo,
    selectByIdSexo,
    updateSexo,
    deleteSexo
}