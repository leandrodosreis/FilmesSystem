/*
Objetivo: Arquivo responsavel pelo CRUD de dados do filme no banco de dados MySQL
Data: 15/04/2026
Autor: Marcel
Versão: 1.0
*/

//Import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

// Função para inserir um novo filme no banco de dados
const insertFilme = async function(filme){

    try {
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

        // Encaminha para o BD o scriptSQL
        let result = await knexConection.raw(sql)

        if(result){
            return result[0].insertId //Retorna o id gerado pelo insert
        }else{
            return false
        }
    } catch (error) {
        return false    
    }
}

// Função para retornar todos os dados de filme do banco de dados 
const selectAllFilme = async function(){

    try {
        //Script sql para listar todos os filmes
        let sql = 'select * from tbl_filme order by id desc;'

        //Executa no banco o script e giarda o retorno do banco
        //Pode ser um ERRO(false) ou um array com os dados
        let result = await knexConection.raw(sql)

        //Validação para verificar se o bd esta retornando
        //Array ou um Boolean (false)
        if(Array.isArray(result)){
            return result[0] //retorna somente o indice com a lista de filmes
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}

// Função para retornar um filme filtrando pelo id
const selectByIdFilme = async function(id){
    try {
        let sql = `select * from tbl_filme where id=${id};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
        
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

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

// Função para excluir um filme filtrando pelo id
const deleteFilme = async function(id){
    try {
        let sql = `delete from tbl_filme where id =${id};`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

module.exports = {
    insertFilme, 
    updateFilme, 
    selectAllFilme, 
    selectByIdFilme, 
    deleteFilme}