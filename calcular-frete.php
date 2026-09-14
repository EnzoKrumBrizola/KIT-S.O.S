<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Recebe o CEP via POST
$input = json_decode(file_get_contents('php://input'), true);
$cepDestino = preg_replace('/[^0-9]/', '', $input['postal_code'] ?? '');

if (strlen($cepDestino) !== 8) {
    echo json_encode(['error' => 'CEP inválido']);
    exit;
}

// TOKEN DO MELHOR ENVIO (Nunca exponha isso no front-end!)
$token = 'SEU_TOKEN_DO_MELHOR_ENVIO_AQUI';

// Dados da embalagem do Kit S.O.S.
$body = [
    'from' => [
        'postal_code' => '83020000' // CEP de origem (São José dos Pinhais - PR)
    ],
    'to' => [
        'postal_code' => $cepDestino
    ],
    'products' => [
        [
            'id' => 'kit-sos',
            'width' => 20,    // Largura em cm
            'height' => 15,   // Altura em cm
            'length' => 30,   // Comprimento em cm
            'weight' => 3.5,  // Peso em kg
            'insurance_value' => 617.90, // Valor com NF-e
            'quantity' => 1
        ]
    ]
];

$ch = curl_init('https://melhorenvio.com.br/api/v2/me/shipment/calculate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token,
    'User-Agent: Casa do Parafuso (contato@casadoparafuso.com.br)'
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
