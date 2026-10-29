create database jogos;

use jogos;

create table genero(
	id_g int auto_increment primary key,
    nome varchar(100) not null,
    descricao varchar(200) not null
);

create table jogos(
	id_j int auto_increment primary key,
    id_genero int not null,
    foreign key (id_genero) references genero(id_g),
    nome varchar(200) not null,
    desenvolvedora varchar(200) not null,
    sinopse varchar(200) not null
);

