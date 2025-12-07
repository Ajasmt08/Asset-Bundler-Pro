<?php
/**
 * Get Images API
 * 
 * Fetches images from multiple stock photo APIs (Pexels, Pixabay, Unsplash)
 * and returns them as JSON.
 * 
 * @author Asset Bundler Pro
 * @version 1.0.0
 */

require_once __DIR__ . '/../includes/AssetBundler.php';
require_once __DIR__ . '/../includes/config.php';

// Set JSON response header
header('Content-Type: application/json');

// --- CONFIGURATION ---
$query = $_GET['topic'] ?? 'shoes';
$count = intval($_GET['limit'] ?? 10);
$offset = intval($_GET['offset'] ?? 0); // New parameter for pagination

$bundler = new AssetBundler();
$allImages = [];

try {
    // Calculate random distribution across 3 APIs
    $base = floor($count / 3);
    $remainder = $count % 3;
    
    $counts = [$base, $base, $base];
    
    // Randomly distribute remainder
    $indices = [0, 1, 2];
    shuffle($indices);
    for ($i = 0; $i < $remainder; $i++) {
        $counts[$indices[$i]]++;
    }
    
    // Shuffle counts for randomness
    shuffle($counts);
    
    list($pexelsCount, $pixabayCount, $unsplashCount) = $counts;
    
    // --- FETCH FROM PEXELS ---
    if ($pexelsCount > 0) {
        // Add page parameter for pagination
        $page = floor($offset / 3 / $pexelsCount) + 1;
        $url = "https://api.pexels.com/v1/search?query=" . urlencode($query) . "&per_page={$pexelsCount}&page={$page}";
        $response = $bundler->fetchUrl($url, ["Authorization: " . PEXELS_API_KEY]);
        
        if ($response) {
            $data = json_decode($response, true);
            $photos = $data['photos'] ?? [];
            
            foreach ($photos as $photo) {
                if (isset($photo['src']['original'])) {
                    $allImages[] = [
                        'url' => $photo['src']['original'],
                        'thumbnail' => $photo['src']['medium'] ?? $photo['src']['large'],
                        'id' => $photo['id'],
                        'source' => 'pexels'
                    ];
                }
            }
        }
    }
    
    // --- FETCH FROM PIXABAY ---
    if ($pixabayCount > 0) {
        // Add page parameter for pagination
        $page = floor($offset / 3 / $pixabayCount) + 1;
        $url = "https://pixabay.com/api/?key=" . PIXABAY_API_KEY . "&q=" . urlencode($query) . 
               "&image_type=photo&per_page={$pixabayCount}&page={$page}";
        $response = $bundler->fetchUrl($url);
        
        if ($response) {
            $data = json_decode($response, true);
            $hits = $data['hits'] ?? [];
            
            foreach ($hits as $hit) {
                $imageUrl = $hit['fullHDURL'] ?? $hit['largeImageURL'] ?? null;
                if ($imageUrl) {
                    $allImages[] = [
                        'url' => $imageUrl,
                        'thumbnail' => $hit['webformatURL'] ?? $imageUrl,
                        'id' => $hit['id'],
                        'source' => 'pixabay'
                    ];
                }
            }
        }
    }
    
    // --- FETCH FROM UNSPLASH ---
    if ($unsplashCount > 0) {
        // Add page parameter for pagination
        $page = floor($offset / 3 / $unsplashCount) + 1;
        $url = "https://api.unsplash.com/search/photos?query=" . urlencode($query) . 
               "&per_page={$unsplashCount}&page={$page}";
        $response = $bundler->fetchUrl($url, ["Authorization: Client-ID " . UNSPLASH_ACCESS_KEY]);
        
        if ($response) {
            $data = json_decode($response, true);
            $photos = $data['results'] ?? [];
            
            foreach ($photos as $photo) {
                $imageUrl = $photo['urls']['full'] ?? $photo['urls']['regular'] ?? null;
                if ($imageUrl) {
                    $allImages[] = [
                        'url' => $imageUrl,
                        'thumbnail' => $photo['urls']['small'] ?? $imageUrl,
                        'id' => $photo['id'],
                        'source' => 'unsplash'
                    ];
                }
            }
        }
    }
    
    if (empty($allImages)) {
        throw new Exception("No photos found for the query: '{$query}'.");
    }
    
    // Shuffle final results for variety
    shuffle($allImages);
    
    echo json_encode([
        'success' => true,
        'count' => count($allImages),
        'images' => $allImages,
        'query' => $query,
        'distribution' => [
            'pexels' => $pexelsCount,
            'pixabay' => $pixabayCount,
            'unsplash' => $unsplashCount
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}