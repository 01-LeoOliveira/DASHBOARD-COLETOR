create database controledecoletor;
use controledecoletor;
create table usuarios(
	id int not null primary key auto_increment,
    nome varchar (20) not null,
    matricula int not null unique,
    turno enum("manhã","tarde","noite") not null,
    setor enum("recebimento","separação","conferencia","segregados","expedição","armazenagem","reposição") not null
);
select *from usuarios;
insert into usuarios (nome,matricula,turno,setor) values ("Daniel",112343,"manhã","recebimento");
select *from usuarios where id = 1;
create table coletores(
	id int not null primary key auto_increment,
    sn varchar(100) unique not null,
    modelo varchar(100)not null,
    usuario_vinculado int unique
);
insert into coletores (sn,modelo) values ("19361B5B34","EDA60K");
select u.nome, c.sn, c.modelo from usuarios as u left join coletores as c on (c.usuario_vinculado = u.id);
update coletores set usuario_vinculado = 1 where id = 1;
update coletores set usuario_vinculado = "" where id = 1;
alter table coletores modify column usuario_vinculado int unique;
select u.nome, c.sn, c.modelo from usuarios as u left join coletores as c on (c.usuario_vinculado = u.id) where c.usuario_vinculado != "";
delete from usuarios where id = 1;