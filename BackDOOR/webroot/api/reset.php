<?php
header('Content-Type: application/json');

// Files on disk are permanent — once uploaded they stay.
// Reset only clears the client-side solved state (handled in JS).
echo json_encode(['success' => true, 'message' => 'Lab reset.']);
