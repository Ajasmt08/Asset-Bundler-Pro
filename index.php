<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Bundler Pro</title>
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
<body class="p-4 sm:p-8" style="background-color: #F4F4F2;">

    <div class="max-w-6xl mx-auto">
        <header class="text-center mb-10 fade-in">
            <h1 class="text-4xl font-extrabold mb-2" style="color: #495464;">Asset Bundler Pro 📦</h1>
            <p class="text-lg" style="color: #495464;">Bulk-fetch and bundle images from Pexels, Pixabay, and Unsplash.</p>
        </header>

        <!-- Input Form -->
        <div id="controls-section" class="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-10 slide-up" style="border: 2px solid #E8E8E8;">
            <h2 class="text-2xl font-semibold mb-6" style="color: #495464;">Generate Assets</h2>
            
            <div>
                <!-- Topic -->
                <div>
                    <label for="topic" class="block text-sm font-medium mb-1" style="color: #495464;">Topic/Keyword</label>
                    <input type="text" id="topic" value="shoes" placeholder="e.g., watch, organic food, laptops" class="w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2" style="border-color: #E8E8E8; background-color: #F4F4F2; color: #495464;">
                    <p class="mt-1 text-xs" style="color: #BBBFCA;">Will fetch 30 images from multiple sources</p>
                </div>
            </div>

            <div class="mt-6">
                <button id="fetch-button" class="w-full flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg shadow-sm text-white transition duration-150 ease-in-out" style="background-color: #495464; border-color: #495464;">
                    <svg id="fetch-icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Get Images</span>
                </button>
            </div>
            
            <div id="loading-indicator" class="mt-4 text-center hidden">
                <div class="spinner"></div>
                <p class="mt-3 text-sm" style="color: #495464;">Fetching images from multiple sources...</p>
                <div class="progress-bar mt-2">
                    <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                </div>
            </div>
            
            <div id="message-box" class="mt-4 p-3 rounded-lg text-sm hidden"></div>
            
            <!-- Download buttons - hidden initially -->
            <div id="download-controls" class="mt-6 flex flex-col sm:flex-row gap-4 hidden">
                <button id="download-button" class="w-full sm:w-1/2 flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg shadow-sm transition duration-150 ease-in-out" style="background-color: #BBBFCA; border-color: #BBBFCA; color: white;">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.888-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                    <span>Download All (ZIP)</span>
                </button>
                <button id="download-selected-btn" class="w-full sm:w-1/2 flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" style="background-color: #495464; border-color: #495464; color: white;" disabled>
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.888-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                    <span>Download Selected</span>
                </button>
            </div>
        </div>

        <!-- Preview Section -->
        <div class="mb-10 hidden" id="preview-section">
            <h2 class="text-2xl font-semibold mb-4" style="color: #495464;">Images</h2>
            <div id="selection-controls" class="mb-4">
                <button id="select-all-btn" class="px-4 py-2 rounded-lg text-sm font-medium transition" style="background-color: #E8E8E8; color: #495464;">
                    Select All
                </button>
                <span class="ml-3 text-sm" style="color: #BBBFCA;" id="selection-count">0 selected</span>
            </div>
            <div id="image-preview" class="min-h-32 rounded-xl p-4" style="background-color: #E8E8E8;">
            </div>
        </div>

        <!-- PHP Scripts Placeholder (Informational only) -->
        <footer class="text-center text-xs mt-10" style="color: #BBBFCA;">
            Images fetched from Pexels, Pixabay, and Unsplash APIs. Ensure PHP development server is running.
        </footer>
    </div>

    <!-- Custom JS -->
    <script src="assets/js/app.js"></script>
</body>
</html>