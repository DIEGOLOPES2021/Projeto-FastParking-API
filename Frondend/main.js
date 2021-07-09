'use strict';

const openModalPrices = () => document.querySelector('#modal-Prices').classList.add('active');
const closeModalPrices = () => document.querySelector('#modal-Prices').classList.remove('active');

const openModalReceipt = () => document.querySelector('#modal-receipt').classList.add('active');
const closeModalReceipt = () => document.querySelector('#modal-receipt').classList.remove('active');

const openModalExit = () => document.querySelector('#modal-exit').classList.add('active');
const closeModalExit = () => document.querySelector('#modal-exit').classList.remove('active');


const getCar = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}


const createCar = async (carro) => {
    const url = 'https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros';
    const opitions = {
        method: 'POST',
        body: JSON.stringify(carro)
    };
    await fetch(url, opitions);
}

const createPrice = async (preco) => {
    const url = 'https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/precos';
    const opitions = {
        method: 'POST',
        body: JSON.stringify(preco)
    };
    await fetch(url, opitions);
}

const updateCar = async (carro, index) => {

    const url = `https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros/${index}`;
    const opitions = {
        method: 'PUT',
        body: JSON.stringify(carro)
    };
    await fetch(url, opitions);
}

const createRow = (carro, index) => {
    const tableCars = document.querySelector('#tableCars tbody')
    const newTr = document.createElement('tr');
    // console.log(client);
    newTr.innerHTML = `                
        <td>${carro.nome}</td>
        <td>${carro.placa}</td>
        <td>${carro.dataEntrada}</td>
        <td>${carro.horaEntrada}</td>
        <td>
            <button data-index="${index+1}" id="button-receipt" class="button green" type="button">Comp.</button>
            <button data-index="${index+1}" id="button-edit" class="button blue" type="button">Editar</button>
            <button data-index="${index+1}" id="button-exit" class="button red" type="button">Saída</button>
        </td>`;

    if (carro.statusCarro == 1) {
        tableCars.appendChild(newTr);
    }
}

const clearInputs = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
    document.getElementById('nome').dataset.idcar = "new";
}

const clearTable = () => {
    const recordCar = document.querySelector('#tableCars tbody');
    while (recordCar.firstChild) {
        recordCar.removeChild(recordCar.lastChild);
    }
}

const updateTable = async () => {
    clearTable();
    const url = 'https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros';
    const carros = await getCar(url);
    carros.forEach(createRow);
}

const isValidFormRegister = () => document.querySelector('#form-register').reportValidity();

const saveCar = async () => {
    if (isValidFormRegister()) {
        const newCar = {
            nome: document.querySelector('#nome').value,
            placa: document.querySelector('#placa').value
        }
        const idCar = document.getElementById('nome').dataset.idcar;
        if(idCar == "new"){
            await createCar(newCar);
        }else{
            await updateCar(newCar, idCar);
        }
        updateTable();
        clearInputs();
    }
}

const isValidFormPrice = () => document.querySelector('#form-price').reportValidity();

const savePrice = async () => {
    if (isValidFormPrice()) {
        const newPrice = {
            primeiraHora: document.querySelector('#primeira-hora').value,
            demaisHoras: document.querySelector('#demais-horas').value
        }
        await createPrice(newPrice);
        clearInputs();
        closeModalPrices();
    }
}

const setReceipt = async (index) => {
    const url = `https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros/${index}`;
    const carro = await getCar(url);
    const input = Array.from(document.querySelectorAll('#form-receipt input'));
    input[0].value = carro.nome;
    input[1].value = carro.placa;
    input[2].value = carro.dataEntrada;
    input[3].value = carro.horaEntrada;
}

const deleteCar = async (index) => {
    const url = `https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros/${index}`;
    const opitions = {
        method: 'DELETE'
    }
    await fetch(url, opitions);
}

const setExit = async (index) => {
    await deleteCar(index);
    const carro = await getCar(`https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros/${index}`);

    console.log(carro)

    const input = Array.from(document.querySelectorAll('#form-exit input'));
    input[0].value = carro.nome;
    input[1].value = carro.placa;
    input[2].value = carro.horaEntrada;
    input[3].value = carro.horaSaida;
    input[4].value = carro.valorPago;

    updateTable();
}

const fillInputsEdit = async (index) => {

    const url = `https://mnemotechnic-foreca.000webhostapp.com/fastparkingapi/carros/${index}`;
    const carro = await getCar(url);
    document.querySelector('#nome').value = carro.nome
    document.querySelector('#placa').value = carro.placa
    document.getElementById('nome').dataset.idcar = carro.idCarro;
   
}

const getButtons = (event) => {
    const button = event.target;
    if (button.id == "button-receipt") {
        const index = button.dataset.index;
        openModalReceipt();
        setReceipt(index);
    } else if (button.id == "button-exit") {
        const index = button.dataset.index;
        openModalExit();
        setExit(index);
    } else if (button.id == "button-edit") {
        const index = button.dataset.index;
        fillInputsEdit(index);
    }

}

const printRecipt = () => {
    window.print();
}

const mask = (text) =>{
    
    text = text.replace(/^(\d)/g, "")
    text = text.replace(/^([a-z-\W])/g, "")
    text = text.replace(/^([A-Z]{3})(\d*)$/, "$1-$2")

    return text;
}

const applyMask = (event) => {
    event.target.value = mask(event.target.value);
}

// MODAL DE PREÇOS
document.querySelector('#precos')
    .addEventListener('click', () => { openModalPrices(); clearInputs() });
document.querySelector('#close-prices')
    .addEventListener('click', () => { closeModalPrices(); clearInputs() });
document.querySelector('#cancelar-prices')
    .addEventListener('click', () => { closeModalPrices(); clearInputs() });
// *****************
// // SELETOR DOS BOTÕES
document.querySelector('#tableCars')
    .addEventListener('click', getButtons);
// ******************
//MODAL COMPROVANTE
document.querySelector('#close-receipt')
    .addEventListener('click', () => { closeModalReceipt(); clearInputs() });
document.querySelector('#cancelar-receipt')
    .addEventListener('click', () => { closeModalReceipt(); clearInputs() });
//MODAL SAÍDA
document.querySelector('#close-exit')
    .addEventListener('click', () => { closeModalExit(); clearInputs() });
document.querySelector('#cancelar-exit')
    .addEventListener('click', () => { closeModalExit(); clearInputs() });
//SALVAR CARRO
document.querySelector('#salvar')
    .addEventListener('click', saveCar);
//SALVAR PREÇO
document.querySelector('#salvarPreco')
    .addEventListener('click', savePrice);
// IMPRESÃO
document.querySelector('#imprimir-receipt').addEventListener('click', printRecipt)
document.querySelector('#imprimir-exit').addEventListener('click', printRecipt)
//MASCARA
document.querySelector('#placa')
    .addEventListener('keyup', applyMask);

updateTable();