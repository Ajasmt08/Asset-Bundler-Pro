<?php

/**
 * AssetBundler Class
 * 
 * Handles downloading images from URLs and creating ZIP archives.
 * Used by the Asset Bundler Pro application to bundle images from multiple APIs.
 * 
 * @author Asset Bundler Pro
 * @version 1.0.0
 */
class AssetBundler 
{
    /**
     * Downloads images and creates a ZIP file.
     *
     * @param array $imageUrls Array of image URLs to download.
     * @param string $zipName The desired name of the ZIP file (without extension).
     * @return string|null Path to the created ZIP file or null on failure
     */
    public function createAndSaveZip(array $imageUrls, string $zipName) 
    {
        if (empty($imageUrls)) {
            return null;
        }

        // Increase memory limit for large operations
        ini_set('memory_limit', '512M');
        
        // Ensure downloads directory exists
        $downloadsDir = __DIR__ . '/../downloads';
        if (!is_dir($downloadsDir)) {
            mkdir($downloadsDir, 0755, true);
        }

        $zipPath = $downloadsDir . '/' . $zipName . '.zip';
        $zip = new ZipArchive();
        
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
            return null;
        }

        foreach ($imageUrls as $index => $url) {
            // Skip if we've been running for too long (prevent timeout)
            if ($index > 0 && $index % 10 === 0) {
                // Small delay to prevent server overload
                usleep(100000); // 0.1 second
            }
            
            $imageData = $this->fetchUrl($url);
            if ($imageData !== false) {
                // Extract extension from URL or content type
                $ext = $this->getImageExtension($url, $imageData);
                $filename = "{$zipName}_" . ($index + 1) . ".{$ext}";
                $zip->addFromString($filename, $imageData);
                
                // Free memory
                unset($imageData);
            }
        }

        $zip->close();

        if (file_exists($zipPath) && filesize($zipPath) > 0) {
            return $zipPath;
        } else {
            // Clean up empty file
            if (file_exists($zipPath)) {
                unlink($zipPath);
            }
            return null;
        }
    }

    /**
     * Downloads images and creates a ZIP file for immediate download.
     *
     * @param array $imageUrls Array of image URLs to download.
     * @param string $zipName The desired name of the ZIP file (without extension).
     * @return void
     */
    public function createAndDownloadZip(array $imageUrls, string $zipName) 
    {
        if (empty($imageUrls)) {
            die("No images to bundle.");
        }

        // Increase memory limit for large operations
        ini_set('memory_limit', '512M');
        
        $zip = new ZipArchive();
        $tempZip = tempnam(sys_get_temp_dir(), 'asset_bundler_') . '.zip';
        
        if ($zip->open($tempZip, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
            die("Could not create ZIP file.");
        }

        foreach ($imageUrls as $index => $url) {
            // Skip if we've been running for too long (prevent timeout)
            if ($index > 0 && $index % 10 === 0) {
                // Small delay to prevent server overload
                usleep(100000); // 0.1 second
            }
            
            $imageData = $this->fetchUrl($url);
            if ($imageData !== false) {
                // Extract extension from URL or content type
                $ext = $this->getImageExtension($url, $imageData);
                $filename = "{$zipName}_" . ($index + 1) . ".{$ext}";
                $zip->addFromString($filename, $imageData);
                
                // Free memory
                unset($imageData);
            }
        }

        $zip->close();

        if (file_exists($tempZip) && filesize($tempZip) > 0) {
            $this->sendZipToBrowser($tempZip, $zipName . '.zip');
        } else {
            die("Error: ZIP file is empty or could not be created.");
        }
    }

    /**
     * Helper to fetch URL content with cURL.
     *
     * @param string $url
     * @param array $headers Optional headers
     * @return string|false
     */
    public function fetchUrl(string $url, array $headers = []) 
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For dev environments
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // 30 second timeout
        
        if (!empty($headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }

        $data = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$data) {
            return false;
        }

        return $data;
    }

    /**
     * Determines the image file extension from URL or image data.
     *
     * @param string $url The image URL
     * @param string $imageData The raw image data
     * @return string The file extension (jpg, png, gif, webp, etc.)
     */
    private function getImageExtension(string $url, string $imageData): string 
    {
        // Try to get extension from URL
        $parsedUrl = parse_url($url);
        if (isset($parsedUrl['path'])) {
            $pathInfo = pathinfo($parsedUrl['path']);
            if (isset($pathInfo['extension'])) {
                $ext = strtolower($pathInfo['extension']);
                // Validate it's a common image extension
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'])) {
                    return $ext === 'jpeg' ? 'jpg' : $ext;
                }
            }
        }

        // Fallback: detect from image data (magic bytes)
        $magicBytes = substr($imageData, 0, 12);
        
        if (strpos($magicBytes, "\xFF\xD8\xFF") === 0) {
            return 'jpg';
        } elseif (strpos($magicBytes, "\x89PNG") === 0) {
            return 'png';
        } elseif (strpos($magicBytes, "GIF") === 0) {
            return 'gif';
        } elseif (strpos($magicBytes, "RIFF") === 0 && strpos($magicBytes, "WEBP") !== false) {
            return 'webp';
        }

        // Default fallback
        return 'jpg';
    }

    /**
     * Sends the ZIP file to the browser and deletes it.
     *
     * @param string $filePath
     * @param string $downloadName
     * @return void
     */
    private function sendZipToBrowser(string $filePath, string $downloadName) 
    {
        header('Content-Type: application/zip');
        header("Content-Disposition: attachment; filename=\"{$downloadName}\"");
        header('Content-Length: ' . filesize($filePath));
        header('Pragma: no-cache');
        header('Expires: 0');
        
        readfile($filePath);
        unlink($filePath);
        exit;
    }
}