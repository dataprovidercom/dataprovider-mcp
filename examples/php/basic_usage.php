<?php

$API_KEY = "dp_sxmCGwnuFgxeLhJq1xM4cXJA7vab1Z0zmLciAhchRX";

function rpc($endpoint, $method, $params) {
    $body = json_encode([
        'jsonrpc' => '2.0',
        'id' => bin2hex(random_bytes(6)),
        'method' => $method,
        'params' => $params,
    ]);
    $opts = [
        'http' => [
            'method' => 'POST',
            'header' => "Accept: application/json, text/event-stream\r\nContent-Type: application/json\r\n",
            'content' => $body,
        ],
    ];
    $ctx = stream_context_create($opts);
    $fp = fopen($endpoint, 'r', false, $ctx);
    if (!$fp) return [];
    stream_set_timeout($fp, 8);
    while (!feof($fp)) {
        $line = fgets($fp);
        if ($line === false) break;
        $trim = trim($line);
        if (str_starts_with($trim, 'data:')) {
            $json = ltrim(substr($trim, 5));
            $obj = json_decode($json, true);
            fclose($fp);
            return is_array($obj) ? ($obj['result'] ?? $obj) : [];
        }
    }
    fclose($fp);
    return [];
}

$endpoint = 'https://mcp.dataprovider.com/mcp?api-key=' . urlencode($API_KEY);

function structured_from($res) {
    if (isset($res['structuredContent'])) return $res['structuredContent'];
    $first = $res['content'][0]['text'] ?? null;
    if (is_string($first)) {
        $parsed = json_decode($first, true);
        if (is_array($parsed)) return $parsed;
    }
    return [];
}

// 1) Get available fields and assume access to 'hostname' and 'cms'
$fieldsRes = rpc($endpoint, 'tools/call', ['name' => 'get_available_fields', 'arguments' => []]);
$fieldsStructured = structured_from($fieldsRes);
$apiNames = array_values(array_filter(array_map(fn($f) => $f['apiName'] ?? null, $fieldsStructured['fields'] ?? [])));
$chosen = ['hostname', 'cms'];

// 2) Create filter from natural language
$filterRes = rpc($endpoint, 'tools/call', ['name' => 'create_query_filter', 'arguments' => ['question' => 'WordPress sites in US']]);
$filter = (structured_from($filterRes)['filter'] ?? null);

// 3) Lookup using the selected fields and returned filter
$lookupRes = rpc($endpoint, 'tools/call', ['name' => 'lookup_data', 'arguments' => ['filter' => $filter, 'fields' => $chosen, 'page' => 0, 'size' => 5]]);
echo json_encode(($lookupRes['structuredContent'] ?? $lookupRes), JSON_PRETTY_PRINT) . "\n";
