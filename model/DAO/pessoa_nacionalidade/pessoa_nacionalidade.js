/*
Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL referente ao relacionamento pessoa e nacionalidade
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


// Função para inserir dados na tabela de relacionamento pessoa nacionalidade
const insertPessoaNacionalidade = async function(pessoaNacionalidade){

    try {

        // Script SQL responsável por inserir um relacionamento entre pessoa e nacionalidade
        let sql = `
        insert into tbl_pessoa_nacionalidade (
                    id_pessoa,
                    id_nacionalidade
                    ) values (
                    ${pessoaNacionalidade.id_pessoa},
                    ${pessoaNacionalidade.id_nacionalidade}
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


// Função para retornar todos os dados do relacionamento pessoa nacionalidade
const selectAllPessoaNacionalidade = async function(){

    try {

        // Script SQL para listar todos os relacionamentos entre pessoa e nacionalidade
        let sql = 'select * from tbl_pessoa_nacionalidade order by id desc;'

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


// Função para retornar um relacionamento pessoa nacionalidade filtrando pelo ID
const selectByIdPessoaNacionalidade = async function(id){

    try {

        // Script SQL para buscar um relacionamento pelo identificador informado
        let sql = `select * from tbl_pessoa_nacionalidade where id=${id};`

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


// Função para retornar as nacionalidades relacionadas com uma pessoa pelo ID da pessoa
const selectNacionalidadeByIdPessoa = async function(idPessoa){

    try {

        // Script SQL para buscar as nacionalidades vinculadas a uma pessoa
        let sql = `select tbl_nacionalidade.*
                        from tbl_pessoa
                            inner join tbl_pessoa_nacionalidade
                                on tbl_pessoa.id = tbl_pessoa_nacionalidade.id_pessoa
                            inner join tbl_nacionalidade
                                on tbl_nacionalidade.id = tbl_pessoa_nacionalidade.id_nacionalidade

                            where tbl_pessoa.id=${idPessoa};`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna as nacionalidades encontradas
            return result[0]
        
        }else{
        
            return false
        
        }

    } catch (error) {

        return false

    }
}


// Função para retornar as pessoas relacionadas com uma nacionalidade pelo ID da nacionalidade
const selectPessoaByIdNacionalidade = async function(idNacionalidade){

    try {

        // Script SQL para buscar as pessoas vinculadas a uma nacionalidade
        let sql = `select tbl_pessoa.*
                        from tbl_pessoa
                            inner join tbl_pessoa_nacionalidade
                                on tbl_pessoa.id = tbl_pessoa_nacionalidade.id_pessoa
                            inner join tbl_nacionalidade
                                on tbl_nacionalidade.id = tbl_pessoa_nacionalidade.id_nacionalidade
                                
                            where tbl_nacionalidade.id=${idNacionalidade};`

        // Executa o script SQL no banco de dados
        let result = await knexConection.raw(sql)

        // Validação para verificar se o banco retornou dados
        if(Array.isArray(result)){

            // Retorna as pessoas encontradas
            return result[0]
        
        }else{
        
            return false
        
        }

    } catch (error) {

        return false

    }
}


// Função para atualizar um relacionamento pessoa nacionalidade existente
const updatePessoaNacionalidade = async function(pessoaNacionalidade){

    try {

        // Script SQL responsável por atualizar o relacionamento pelo ID informado
        let sql = `update tbl_pessoa_nacionalidade set
                        id_pessoa = ${pessoaNacionalidade.id_pessoa},
                        id_nacionalidade = ${pessoaNacionalidade.id_nacionalidade} 
                    where id = ${pessoaNacionalidade.id};`

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


// Função responsável por excluir um relacionamento pessoa nacionalidade
const deletePessoaNacionalidade = async function(id){

    try {

        // Script SQL responsável por excluir um relacionamento pelo identificador
        let sql = `delete from tbl_pessoa_nacionalidade where id =${id};`

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


// Função responsável por excluir as nacionalidades relacionadas com uma pessoa
// Obs: esta função será utilizada no PUT da pessoa
const deleteNacionalidadeByIdPessoa = async function(idPessoa){

    try {

        // Script SQL responsável por excluir as nacionalidades relacionadas à pessoa
        let sql = `delete from tbl_pessoa_nacionalidade where id_filme =${idPessoa};`

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
    insertPessoaNacionalidade,
    updatePessoaNacionalidade,
    selectAllPessoaNacionalidade,
    selectByIdPessoaNacionalidade,
    deletePessoaNacionalidade,
    selectPessoaByIdNacionalidade,
    selectNacionalidadeByIdPessoa,
    deleteNacionalidadeByIdPessoa
}