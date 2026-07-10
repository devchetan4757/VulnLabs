<?php
header('Content-Type: application/json');

$FILES_DIR = __DIR__ . '/../files';

if (!is_dir($FILES_DIR)) {
    mkdir($FILES_DIR, 0755, true);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded.']);
    exit;
}

$file     = $_FILES['file'];
$filename = basename($file['name']);
$destination = $FILES_DIR . '/' . $filename;

// Write-once — reject if a file with this name already exists
if (file_exists($destination)) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'A file with that name already exists.']);
    exit;
}

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file.']);
    exit;
}

echo json_encode([
    'success'  => true,
    'filename' => $filename,
    'path'     => '/files/' . $filename
]);
