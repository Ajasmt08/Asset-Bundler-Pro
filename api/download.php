<?php
/**
 * Download API
 * 
 * Creates a ZIP file from image URLs and immediately sends it to the browser
 * for download.
 * 
 * @author Asset Bundler Pro
 * @version 1.0.0
 */

require_once __DIR__ . '/../includes/AssetBundler.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die("Method not allowed. Use POST.");
}

// Get data from either JSON payload or form data
$data = null;

if (isset($_POST['images_json'])) {
    // Form submission
    $data = json_decode($_POST['images_json'], true);
} else {
    // JSON payload
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
}

if (!$data || !isset($data['images']) || !is_array($data['images'])) {
    http_response_code(400);
    die("Invalid request. Expected JSON with 'images' array.");
}

$imageUrls = $data['images'];
$zipName = $data['zipName'] ?? 'selected_images_' . time();

if (empty($imageUrls)) {
    http_response_code(400);
    die("No images provided.");
}

$bundler = new AssetBundler();
$bundler->createAndDownloadZip($imageUrls, $zipName);