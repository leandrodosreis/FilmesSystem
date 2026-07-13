/*
Objetivo: Arquivo responsavel pelo CRUD no banco de dados MySQL referente o relacionamento filme e genero
Data: 8/05/2026
Autor: Marcel
Versão: 1.0
*/

//Import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//Import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

// Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

//Função para inserir dados na tabela filme genero
const insertPessoaNacionalidade = async function(pessoaNacionalidade){

    try {

        let sql = `
        insert into tbl_pessoa_nacionalidade (
                    id_pessoa,
                    id_nacionalidade
                    ) values (
                    ${pessoaNacionalidade.id_pessoa},
                    ${pessoaNacionalidade.id_nacionalidade}
        );`

        let result = await knexConection.raw(sql)

        if(result){
        return result[0].insertId
        }else{
            return false
        }

    } catch (error) {
        return false
    }
    
}

//Função para retornar todos os dados do filme genero
const selectAllPessoaNacionalidade = async function(){
        try {
        //Script sql para listar todos os generos
        let sql = 'select * from tbl_pessoa_nacionalidade order by id desc;'

        //Executa no banco o script e guarda o retorno do banco
        //Pode ser um ERRO(false) ou um array com os dados
        let result = await knexConection.raw(sql)

        //Validação para verificar se o bd esta retornando
        //Array ou um Boolean (false)
        if(Array.isArray(result)){
            return result[0] //retorna somente o indice com a lista de genero
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

//Função para retornar os dados do filme genero por id
const selectByIdPessoaNacionalidade = async function(id){
    try {
        let sql = `select * from tbl_pessoa_nacionalidade where id=${id};`

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

//Função para retornar os dados do genero filtrando pelo id do filme
const selectNacionalidadeByIdPessoa = async function(idPessoa){
    try {
        let sql = `select tbl_nacionalidade.*
                        from tbl_pessoa
                            inner join tbl_pessoa_nacionalidade
                                on tbl_pessoa.id = tbl_pessoa_nacionalidade.id_pessoa
                            inner join tbl_nacionalidade
                                on tbl_nacionalidade.id = tbl_pessoa_nacionalidade.id_nacionalidade

                            where tbl_pessoa.id=${idPessoa};`

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

//Função para retornar os dados do genero filtrando pelo id do filme
const selectPessoaByIdNacionalidade = async function(idNacionalidade){
    try {
        let sql = `select tbl_pessoa.*
                        from tbl_pessoa
                            inner join tbl_pessoa_nacionalidade
                                on tbl_pessoa.id = tbl_pessoa_nacionalidade.id_pessoa
                            inner join tbl_nacionalidade
                                on tbl_nacionalidade.id = tbl_pessoa_nacionalidade.id_nacionalidade
                                
                            where tbl_nacionalidade.id=${idNacionalidade};`

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

//Função para atualizar um filme genero existente 
const updatePessoaNacionalidade = async function(pessoaNacionalidade){
    try {
        let sql = `update tbl_pessoa_nacionalidade set
                        id_pessoa = ${pessoaNacionalidade.id_pessoa},
                        id_nacionalidade = ${pessoaNacionalidade.id_nacionalidade} 
                    where id = ${pessoaNacionalidade.id};`

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

//Função responsavel por excluir um filme genero
const deletePessoaNacionalidade = async function(id){
    try {
        let sql = `delete from tbl_pessoa_nacionalidade where id =${id};`

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

//Função responsavel por excluir os generos relacionados com um filme
//Obs: esta função sera utilizadad no put do filme
const deleteNacionalidadeByIdPessoa = async function(idPessoa){
    try {
        let sql = `delete from tbl_pessoa_nacionalidade where id_filme =${idPessoa};`

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
    insertPessoaNacionalidade,
    updatePessoaNacionalidade,
    selectAllPessoaNacionalidade,
    selectByIdPessoaNacionalidade,
    deletePessoaNacionalidade,
    selectPessoaByIdNacionalidade,
    selectNacionalidadeByIdPessoa,
    deleteNacionalidadeByIdPessoa
}