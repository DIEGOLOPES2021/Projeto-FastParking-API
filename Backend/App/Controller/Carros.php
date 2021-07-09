<?php

use App\Core\Controller;

class Carros extends Controller
{

    public function index(){
        $carroModel = $this->Model("Carro");

        $carros = $carroModel->listAll();

        echo json_encode($carros, JSON_UNESCAPED_UNICODE);
    }

    public function find($id){
        $carroModel = $this->Model("Carro");
        $carro = $carroModel->findById($id);

        if ($carro) {
            echo json_encode($carro, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(400);
            echo json_encode(["erro" => "não encontrada"], JSON_UNESCAPED_UNICODE);
        }
    }

    public function store(){

        $novoCarro = $this->getRequestBody();

        $erros = $this->validarCampos($novoCarro->nome, $novoCarro->placa);
        if (count($erros) > 0) {
            http_response_code(404);
            echo json_encode($erros, JSON_UNESCAPED_UNICODE);

            exit();
        }
        $carroModel = $this->Model("Carro");
        $carroModel->nome = $novoCarro->nome;
        $carroModel->placa = $novoCarro->placa;
        $carroModel->idPreco = $carroModel->getPreco()->idPreco;

        $carroModel = $carroModel->insert();

        if ($carroModel) {
            http_response_code(201);
            echo json_encode($carroModel, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Problemas ao inserir um novo carro"]);
        }
    }
    public function update($id){
        $carroEditar = $this->getRequestBody();

        $erros = $this->validarCampos($carroEditar->nome, $carroEditar->placa);
        if (count($erros) > 0) {
            http_response_code(404);
            echo json_encode($erros, JSON_UNESCAPED_UNICODE);
            exit();
        }

        $carroModel = $this->Model("Carro");
        $carroModel = $carroModel->findById($id);

        if (!$carroModel) {
            http_response_code(404);
            echo json_encode(["erro" => " não encontrada"]);
            exit();
        }

        $carroModel->nome = $carroEditar->nome;
        $carroModel->placa = $carroEditar->placa;

        if ($carroModel->update()) {
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(["erro " => "Problemas ao editar carro"]);
        }
    }

    public function delete($id){
        $carroModel = $this->Model("Carro");
        $carroModel = $carroModel->findById($id);

        if (!$carroModel) {
            http_response_code(404);
            echo json_encode(["erro" => "não encontrada"]);
            exit();
        }
        $valordaPrimeiraHora = $carroModel->getPreco()->primeiraHora;
        $valorDemaisHoras = $carroModel->getPreco()->demaisHoras;

        $horaEntrada = floatval($carroModel->getHourIn($carroModel->horaEntrada)->hora);
        $carroModel->horaSaida = $carroModel->getNowHour()->hora;
        $horaSaida = floatval($carroModel->getHourIn($carroModel->horaSaida)->hora);

        $horasDoEstacionado = $horaEntrada - $horaSaida;
        if ($horasDoEstacionado < 0) {
            $horasDoEstacionado *= -1;
        }
        if ($horasDoEstacionado > 1) {
            $hrsDemais = $horasDoEstacionado - 1;
            $carroModel->valorPago = $hrsDemais * floatval($valorDemaisHoras);
            $carroModel->valorPago += floatval($valordaPrimeiraHora);
        } else {
            $carroModel->valorPago = floatval($valordaPrimeiraHora);
        }
        if ($carroModel->delete()) {
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(["erro " => "Problemas ao editar carro"]);
        }
    }
    private function validarCampos($nome, $placa)
    {
        $erros = [];

        if (!isset($nome) || $nome == "") {
            $erros[] = "O campo nome é obrigatório";
        }
        if (!isset($placa) || $placa == "") {
            $erros[] = "O campo placa é obrigatório";
        }
        return $erros;
    }
}
