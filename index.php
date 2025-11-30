<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Bundler Pro</title>
    <!-- Load Tailwind CSS for modern styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="p-4 sm:p-8">

    <div class="max-w-6xl mx-auto">
        <header class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Asset Bundler Pro 📦</h1>
            <p class="text-lg text-gray-500">Bulk-fetch and bundle images from Pexels, Pixabay, and Unsplash.</p>
        </header>

        <!-- Input Form -->
        <div id="controls-section" class="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-10">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Generate Assets</h2>
            
            <div>
                <!-- Topic -->
                <div>
                    <label for="topic" class="block text-sm font-medium text-gray-700 mb-1">Topic/Keyword</label>
                    <input type="text" id="topic" value="shoes" placeholder="e.g., watch, organic food, laptops" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <p class="mt-1 text-xs text-gray-500">Will fetch 30 images from multiple sources</p>
                </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <button id="fetch-button" class="w-full sm:w-1/2 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                    <svg id="fetch-icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Get Images</span>
                </button>
                
                <button id="download-button" disabled class="w-full sm:w-1/2 flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.888-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                    <span>Download All (ZIP)</span>
                </button>
            </div>
            
            <div id="loading-indicator" class="mt-4 text-center text-sm text-blue-600 hidden">
                <p>Fetching and preparing files... this may take a moment.</p>
            </div>
            <div id="message-box" class="mt-4 p-3 rounded-lg text-sm hidden"></div>
        </div>

        <!-- Preview Section -->
        <div class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Images</h2>
            <div id="selection-controls" class="mb-4 hidden">
                <button id="select-all-btn" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition">
                    Select All
                </button>
                <button id="download-selected-btn" class="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Download Selected
                </button>
            </div>
            <div id="image-preview" class="min-h-32 bg-gray-200 rounded-xl p-4 flex justify-center items-center text-gray-500">
                Click "Get Images" to fetch and display images.
            </div>
        </div>

        <!-- PHP Scripts Placeholder (Informational only) -->
        <footer class="text-center text-gray-400 text-xs mt-10">
            Images fetched from Pexels, Pixabay, and Unsplash APIs. Ensure PHP development server is running.
        </footer>
    </div>

    <!-- Custom JS -->
    <script src="assets/js/app.js"></script>
</body>
</html>