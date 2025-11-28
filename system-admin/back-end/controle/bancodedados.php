<?php
$DB_HOST = 'localhost'; 
$DB_USER = 'root';
$DB_PASS = ''; 
$DB_NAME = 'arcanostore';
$conexao = null;

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexao = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
}
catch (mysqli_sql_exception $e) { error_log('Erro de Conexão SQL no Conector: ' . $e->getMessage()); }
catch (Exception $e) { error_log('Erro Geral ao criar a conexão: ' . $e->getMessage());}