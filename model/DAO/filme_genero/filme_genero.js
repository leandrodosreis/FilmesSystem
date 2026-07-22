/*
Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL referente ao relacionamento filme e gênero
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


// Função para inserir dados na tabela de relacionamento filme gênero
const insertFilmeGenero = async function(filmeGenero){

    try {

        // Script SQL responsável por inserir um relacionamento entre filme e gênero
        let sql = `
        insert into tbl_filme_genero (
                    id_filme,
                    id_genero
                    ) values (
                    ${filmeGenero.id_filme},
                    ${filmeGenero.id_genero}
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


// Função para retornar todos os dados do relacionamento filme gênero
const selectAllFilmeGenero = async function(){

    try {

        // Script SQL para listar todos os relacionamentos entre filmes e gêneros
        let sql = 'select * from tbl_filme_genero order by id desc;'

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


// Função para retornar um relacionamento filme gênero filtrando pelo ID
const selectByIdFilmeGenero = async function(id){

    try {

        // Script SQL para buscar um relacionamento pelo identificador informado
        let sql = `select * from tbl_filme_genero where id=${id};`

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


// Função para retornar os gêneros relacionados com um filme pelo ID do filme
const selectGenerosByIdFilme = async function(idFilme){

    try {

        // Script SQL para buscar os gêneros vinculados a um filme
        let sql = `select tbl_genero.*
                        from tbl_filme
                            inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id_filme
                            inner join tbl_genero
                                on tbl_genero.id = tbl_filme_genero.id_genero

                            where tbl_filme.id=${idFilme};`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna os gêneros encontrados
            return result[0]
        
        }else{
        
            return false
        
        }

    } catch (error) {

        return false

    }
}


// Função para retornar os filmes relacionados com um gênero pelo ID do gênero
const selectFilmesByIdGenero = async function(idGenero){

    try {

        // Script SQL para buscar os filmes vinculados a um gênero
        let sql = `select tbl_filme.*
                        from tbl_filme
                            inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id_filme
                            inner join tbl_genero
                                on tbl_genero.id = tbl_filme_genero.id_genero
                                
                            where tbl_genero.id=${idGenero};`

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


// Função para atualizar um relacionamento filme gênero existente
const updateFilmeGenero = async function(filmeGenero){

    try {

        // Script SQL responsável por atualizar o relacionamento pelo ID informado
        let sql = `update tbl_filme_genero set
                        id_filme = ${filmeGenero.id_filme},
                        id_genero = ${filmeGenero.id_genero} 
                    where id = ${filmeGenero.id};`

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


// Função responsável por excluir um relacionamento filme gênero
const deleteFilmeGenero = async function(id){

    try {

        // Script SQL responsável por excluir um relacionamento pelo identificador
        let sql = `delete from tbl_filme_genero where id =${id};`

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


// Função responsável por excluir os gêneros relacionados com um filme
// Obs: esta função será utilizada no PUT do filme
const deleteGenerosByIdFilme = async function(idFilme){

    try {

        // Script SQL responsável por remover os gêneros vinculados ao filme
        let sql = `delete from tbl_filme_genero where id_filme =${idFilme};`

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
    insertFilmeGenero,
    updateFilmeGenero,
    selectAllFilmeGenero,
    selectByIdFilmeGenero,
    deleteFilmeGenero,
    selectFilmesByIdGenero,
    selectGenerosByIdFilme,
    deleteGenerosByIdFilme
}