<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

echo json_encode([
    'status' => 'success',
    'message' => 'PHP API is working',
    'timestamp' => date('Y-m-d H:i:s')
]);
?> 