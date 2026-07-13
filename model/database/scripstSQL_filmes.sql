#Permite criar um database
create database db_filmes_20261_b;

#Permite visualizar todos os databases existentes
show databases;

#Permite escolher um database a ser utilizado
use db_filmes_20261_b;

#Permite visualizar todas as tabelas existentes dentro do database
show tables;

create table tbl_filme (
	id 					int not null auto_increment primary key,
    nome 				varchar(80) not null,
    sinopse 			text not null,
    capa 				varchar(255) not null,
    data_lancamento 	date not null,
    duracao 			time not null,
    valor 				decimal(5,2) default 0,
    avaliacao 			decimal(3,2) default null
);

#Permite deletar uma tabela
#drop table tbl_filme;

#Permite deletar um database
#drop database db_filmes_20261_b;

#Permite inserir dados em uma tabela
#insert into tbl_filme (
#	nome,
#    sinopse,
#    capa,
#    data_lancamento,
#    duracao,
#    valor,
#    avaliacao
#) values (
#	'Super Mario Galaxy: O Filme',
#    'Uma nova aventura leva Mario a enfrentar um inédito e ameaçador super vilão. Em Super Mario Galaxy: O Filme, o bigodudo encanador italiano e seus aliados embarcam numa aventura galáctica repleta de ação e momentos emocionantes depois de salvar o Reino dos Cogumelos.',
#    'https://br.web.img3.acsta.net/c_310_420/img/5b/ea/5bea1aeac3323aeaaf82449a34fafbbf.jpg',
#    '2026-04-02',
#    '01:39:00',
#    '50.60',
#    '3'
#);

#Permite visualizar conteudos e valores adicionados a tabela
#select * from tbl_filme;

#Mostra a tabela em ordem decrscente
#select * from tbl_filme order by id desc;

#Deleta tudo acima de id 0
#delete from tbl_filme where id > 0;

#Deleta o id 
#delete from tbl_filme where id = 3;

#seleciona uma tabela por id
#select * from tbl_filme where id = 27;

#atualiza atributos de uma tabela
#update tbl_filme set
#	nome = 'Filme 05',
#	sinopse = 'alterei a sinopse',
#	capa = 'alala',
#	data_lancamento = '2026-04-29',
#	duracao = '02:30:00',
#	valor = '10',
#	avaliacao = 2
#where id = 4;

create table tbl_genero (
	id	int not null auto_increment primary key,
    nome	varchar(40) not null
);

#insert into tbl_genero (
#                   nome
#                   ) values (
#                  'Leandro'
#                    );

#select * from tbl_genero order by id desc;

create table tbl_classificacao (
	id				int not null auto_increment primary key,
    sigla		varchar(5) not null,
    nome		varchar(45) not null,
    descricao 	varchar(200) not null
	);

##delete from tbl_filme;

alter table tbl_filme
	add column id_classificacao int not null,
    add constraint FK_CLASSIFICACAO_FILME
		foreign key (id_classificacao)
        references tbl_classificacao(id);

#desc tbl_classificacao;

create table tbl_filme_genero (
	id			int not null auto_increment primary key,
    id_filme			int not null,
    id_genero			int not null,
    
    constraint FK_FILME_FILMEGENERO
    foreign key (id_filme)
    references tbl_filme(id),
    
	constraint FK_GENERO_FILMEGENERO
    foreign key (id_genero)
    references tbl_genero(id)
);


create table tbl_cargo (
	id			int not null auto_increment primary key,
    funcao		varchar(30) not null
);

create table tbl_sexo (
	id			int not null auto_increment primary key,
    sigla		varchar(3) not null,
    nome		varchar(15) not null
);

create table tbl_nacionalidade (
	id	int not null auto_increment primary key,
    nome	varchar(50) not null
);


create table tbl_pessoa(
	id					int not null auto_increment primary key,
    nome				varchar(80) not null,
    data_nascimento		date not null,
    filmografia			text,
    biografia			text,
    foto				varchar(255),
    id_sexo				int not null,
    
    constraint	FK_SEXO_PESSOA
    foreign key (id_sexo)
    references tbl_sexo(id)
);

create table tbl_pessoa_nacionalidade (
	id			int not null auto_increment primary key,
    id_pessoa			int not null,
    id_nacionalidade			int not null,
    
    constraint FK_PESSOA_PESSOANACIONALIDADE
    foreign key (id_pessoa)
    references tbl_pessoa(id),
    
	constraint FK_NACIONALIDADE_PESSOANACIONALIDADE
    foreign key (id_nacionalidade)
    references tbl_nacionalidade(id)
);

show tables;