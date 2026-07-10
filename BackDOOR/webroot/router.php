<?php
// php -S localhost:8000 router.php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$routes = [
    '/api/upload'      => __DIR__ . '/api/upload.php',
    '/api/reset'       => __DIR__ . '/api/reset.php',
    '/api/submit-flag' => __DIR__ . '/api/submit-flag.php',
];

if (isset($routes[$uri])) {
    require $routes[$uri];
    return true;
}

$path = __DIR__ . $uri;

// Serve uploaded PHP files (webshells) — execute them directly
// This is intentional: the lab depends on uploaded .php files running
if (strpos($uri, '/files/') === 0 && file_exists($path) && !is_dir($path)) {
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

    // Images force download so they can't be "executed"
    if (in_array($ext, ['jpg','jpeg','png','gif'], true)) {
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($path) . '"');
        header('Content-Length: ' . filesize($path));
        readfile($path);
        return true;
    }

    // PHP files — execute (this is the shell)
    if ($ext === 'php') {
        require $path;
        return true;
    }
}

// Real static file
if ($uri !== '/' && file_exists($path) && !is_dir($path)) {
    return false;
}

require __DIR__ . '/index.html';
