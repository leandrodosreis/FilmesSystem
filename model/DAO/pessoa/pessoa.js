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
const insertPessoa = async function(pessoa){

    try {
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
const selectAllPessoa = async function(){

    try {
        //Script sql para listar todos os filmes
        let sql = 'select * from tbl_pessoa order by id desc;'

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
const selectByIdPessoa = async function(id){
    try {
        let sql = `select * from tbl_pessoa where id=${id};`

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
const updatePessoa = async function(pessoa){
    try {
        let sql = `update tbl_pessoa set
                        nome                = '${pessoa.nome}',
                        data_nascimento             = '${pessoa.data_nascimento}',
                        filmografia                = '${pessoa.filmografia}',
                        biografia     = '${pessoa.biografia}',
                        foto             = '${pessoa.foto}',
                        id_sexo               = '${pessoa.id_sexo}'
                    where id = ${pessoa.id};`

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
const deletePessoa = async function(id){
    try {
        let sql = `delete from tbl_pessoa where id =${id};`

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
    insertPessoa, 
    updatePessoa, 
    selectAllPessoa, 
    selectByIdPessoa, 
    deletePessoa}