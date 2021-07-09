<?php

use App\Core\Model;

class Preco
{

    public $idPreco;
    public $primeiraHora;
    public $demaisHoras;
    public $dataHora;

    public function listAll()
    {
        $sql = " SELECT * FROM tblPrecos ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);

            return $result;
        } else {
            return [];
        }
    }

    public function insert()
    {
        $sql = " INSERT INTO tblPrecos 
                (dataHora, primeiraHora, demaisHoras) 
                VALUES  (now(), ?, ?) ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->primeiraHora);
        $stmt->bindValue(2, $this->demaisHoras);

        if ($stmt->execute()) {
            $this->idPreco = Model::getConexao()->lastInsertId();
            return $this;
        } else {
            return false;
        }
    }
}
