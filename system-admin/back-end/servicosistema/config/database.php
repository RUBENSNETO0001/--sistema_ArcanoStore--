<?php
class Database {
    public $conn;

    public function __construct() {
        $host = 'localhost';
        $dbname = 'arcanostore';
        $username = 'root';
        $password = ''; // Sua senha do MySQL

        try {
            $this->conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            // Não morre, apenas loga o erro
        }
    }
}
?>