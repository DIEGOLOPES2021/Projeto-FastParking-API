create database fastParking;

use fastParking;

create table tblCarros (
	idCarro int primary key not null auto_increment,
    nome varchar(45) not null,
    placa varchar(8) not null,
    dataEntrada date not null,
    horaEntrada time not null,
    horaSaida time,
	valorPago decimal,
    statusCarro boolean not null,
    idPreco int not null,
    unique key (idCarro),
	constraint FK_Precos_Carros
    foreign key (idPreco) 
    references tblPrecos (idPreco)
);

drop table tblCarros, tblPrecos;
select * from tblPrecos;

create table tblPrecos (

	idPreco int primary key not null auto_increment,

    primeiraHora int not null,

    demaisHoras int not null,

	dataHora datetime,

    unique key (idPreco)

);
        
insert into tblCarros (
nome, 
placa, 
dataEntrada, 
horaEntrada,
statusCarro, 
idPreco) 

	values ('
    Joao ',
    '23456', 
    '0526754', 
    '12:00:00',  
    1, 1 );
    
    UPDATE tblCarros SET statusCarro = 1 WHERE idCarro = 1;
    
INSERT INTO tblPrecos (dataHora, primeiraHora, demaisHoras) 
	VALUES  (now(), 2, 10);

select * from tblCarros;
select * from tblPrecos;



