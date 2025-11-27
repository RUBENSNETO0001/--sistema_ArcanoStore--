<?php
// Configurações do Banco de Dados
$DB_HOST = 'localhost'; 
$DB_USER = 'root';
$DB_PASS = ''; 
$DB_NAME = 'arcanostore'; 

$conexao = null;

try {
    // Relatar erros de MySQLi
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexao = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
    // Definir charset para evitar problemas com acentuação
    $conexao->set_charset("utf8mb4"); 
}
catch (mysqli_sql_exception $e) {
    // Em produção, você só registraria o erro, sem exibi-lo
    error_log('Erro de Conexão SQL no Conector: ' . $e->getMessage()); 
    // Para depuração:
    // die("Erro de Conexão: " . $e->getMessage()); 
}
catch (Exception $e) {
    error_log('Erro Geral ao criar a conexão: ' . $e->getMessage());
}
?>