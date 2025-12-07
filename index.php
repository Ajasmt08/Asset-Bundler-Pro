<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Bundler Pro</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23495464'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg>">
    
    <!-- Load Tailwind CSS for modern styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'light-gray': '#F4F4F2',
                        'medium-gray': '#E8E8E8',
                        'blue-gray': '#BBBFCA',
                        'charcoal': '#495464',
                    }
                }
            }
        }
    </script>
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body class="bg-gradient">

    <div class="max-w-6xl mx-auto">
        <header class="text-center mb-12 fade-in">
            <h1 class="text-5xl font-extrabold mb-3 site-header">Asset Bundler Pro</h1>
            <p class="text-lg site-description">Download and manage images from multiple stock photo sites in one place.</p>
        </header>

        <!-- Input Form -->
        <div id="controls-section" class="p-8 md:p-10 rounded-2xl shadow-2xl mb-12 slide-up">
            <h2 class="text-3xl font-bold mb-8 section-header">Generate Assets</h2>
            
            <div>
                <!-- Topic -->
                <div>
                    <label for="topic" class="block text-sm font-semibold mb-2 input-label">Topic/Keyword</label>
                    <input type="text" id="topic" value="" placeholder="e.g., watch, organic food, laptops" class="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-base form-input">
                    <p class="mt-2 text-xs font-medium input-hint">Will fetch 30 images from multiple sources</p>
                </div>
            </div>

            <div class="mt-8">
                <button id="fetch-button" class="w-full flex items-center justify-center px-8 py-4 border-2 text-base font-semibold rounded-xl shadow-lg text-white transition duration-150 ease-in-out fetch-button">
                    <svg id="fetch-icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Get Images</span>
                </button>
            </div>
            
            <div id="loading-indicator" class="mt-4 text-center hidden">
                <div class="spinner"></div>
                <p class="mt-3 text-sm loading-text">Fetching images from multiple sources...</p>
                <div class="progress-bar mt-2">
                    <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                </div>
            </div>
            
            <div id="message-box" class="mt-4 p-3 rounded-lg text-sm hidden"></div>
            
            <!-- Download buttons - hidden initially -->
            <div id="download-controls" class="mt-8 flex flex-col sm:flex-row gap-4 hidden">
                <button id="download-button" class="w-full sm:w-1/2 flex items-center justify-center px-6 py-4 border-2 text-base font-semibold rounded-xl shadow-lg transition duration-150 ease-in-out download-all-button">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.888-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                    <span>Download All (ZIP)</span>
                </button>
                <button id="download-selected-btn" class="w-full sm:w-1/2 flex items-center justify-center px-6 py-4 border-2 text-base font-semibold rounded-xl shadow-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed download-selected-button">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.888-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                    <span>Download Selected</span>
                </button>
            </div>
        </div>

        <!-- Preview Section -->
        <div class="mb-10 hidden" id="preview-section">
            <h2 class="text-3xl font-bold mb-6 section-header">Images</h2>
            <div id="selection-controls" class="mb-6">
                <button id="select-all-btn" class="px-6 py-3 rounded-xl text-sm font-semibold transition select-all-button">
                    Select All
                </button>
                <span class="ml-4 text-sm font-medium selection-count" id="selection-count">0 selected</span>
            </div>
            <div id="image-preview" class="min-h-32 rounded-2xl p-4 preview-container">
            </div>
            <!-- Load More Button -->
            <div id="load-more-container" class="mt-6 text-center hidden">
                <button id="load-more-button" class="px-6 py-3 rounded-xl text-sm font-semibold transition load-more-button">
                    Load More
                </button>
            </div>
        </div>

        <!-- PHP Scripts Placeholder (Informational only) -->
        <footer class="text-center text-xs mt-10 site-footer">
            Images fetched from Pexels, Pixabay, and Unsplash APIs. Created for developers who need dummy images for demos and prototypes.
        </footer>
    </div>

    <!-- Loading Overlay -->
    <div id="loading-overlay" class="loading-overlay hidden">
        <div class="text-center">
            <div class="spinner"></div>
            <p class="mt-3">Loading more images...</p>
        </div>
    </div>

    <!-- Custom JS -->
    <script src="assets/js/app.js"></script>
</body>
</html>