/* ========================================
   Asset Bundler Pro - Main Application
   ======================================== */

/* ----------------------------
   Global Variables
   ---------------------------- */
let fetchedImages = [];
let selectedImages = new Set();

/* ----------------------------
   Utility Functions
   ---------------------------- */

/**
 * Disables/enables the main interface buttons
 * @param {boolean} isLoading 
 */
function setLoading(isLoading) {
    document.getElementById('fetch-button').disabled = isLoading;
    document.getElementById('loading-indicator').classList.toggle('hidden', !isLoading);

    const fetchButton = document.getElementById('fetch-button');
    const progressFill = document.getElementById('progress-fill');

    if (isLoading) {
        fetchButton.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
        `;
        progressFill.style.width = '0%';
    } else {
        fetchButton.innerHTML = `
            <svg id="fetch-icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Get Images</span>
        `;

        // Complete progress bar
        if (window.progressInterval) {
            clearInterval(window.progressInterval);
        }
        progressFill.style.width = '100%';
        setTimeout(() => {
            progressFill.style.width = '0%';
        }, 500);
    }
}

/**
 * Displays status messages to the user.
 * @param {string} message 
 * @param {string} type 
 */
function showMessage(message, type = 'info') {
    const box = document.getElementById('message-box');
    box.textContent = message;
    box.classList.remove('hidden');
    
    // Clear all styles first
    box.style.backgroundColor = '';
    box.style.color = '';
    box.style.border = '';
    box.style.fontWeight = '';
    box.style.padding = '';
    box.style.borderRadius = '';
    box.style.boxShadow = '';
    
    // Apply base styles
    box.style.padding = '12px 16px';
    box.style.borderRadius = '8px';
    box.style.fontWeight = '500';
    box.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    if (type === 'error') {
        // Red error message that stands out
        box.style.backgroundColor = '#FEE2E2';
        box.style.color = '#991B1B';
        box.style.border = '2px solid #FECACA';
        box.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.2)';
    } else if (type === 'success') {
        // Green success message that stands out
        box.style.backgroundColor = '#DCFFE4';
        box.style.color = '#065F46';
        box.style.border = '2px solid #6EE7B7';
        box.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)';
    } else {
        // Info message
        box.style.backgroundColor = '#DBEAFE';
        box.style.color = '#1E40AF';
        box.style.border = '2px solid #93C5FD';
        box.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)';
    }
    
    // Scroll to message so user sees it
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clears the preview area
 */
function clearPreview() {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    preview.classList.remove('image-grid', 'p-4');
    preview.classList.add('flex', 'justify-center', 'items-center', 'min-h-32', 'bg-gray-200');
    preview.innerHTML = `
        <div class="w-full text-center p-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Fetching images...</h3>
            <p class="mt-1 text-sm text-gray-500">Please wait while we retrieve images from all APIs.</p>
        </div>
    `;
}

/**
 * Animates the progress bar during loading
 */
function animateProgress() {
    const progressFill = document.getElementById('progress-fill');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;

        progressFill.style.width = progress + '%';
    }, 200);

    // Store interval ID to clear it later
    window.progressInterval = interval;
}

/* ----------------------------
   Image Selection Functions
   ---------------------------- */

/**
 * Toggles image selection state
 */
function toggleImageSelection(item, isSelected) {
    const url = item.dataset.url;

    if (isSelected) {
        selectedImages.add(url);
        item.classList.add('selected');
    } else {
        selectedImages.delete(url);
        item.classList.remove('selected');
    }

    updateSelectionControls();
}

/**
 * Updates the selection control buttons
 */
function updateSelectionControls() {
    const downloadSelectedBtn = document.getElementById('download-selected-btn');
    const selectAllBtn = document.getElementById('select-all-btn');
    const selectionCount = document.getElementById('selection-count');

    downloadSelectedBtn.disabled = selectedImages.size === 0;
    selectionCount.textContent = `${selectedImages.size} selected`;

    if (selectedImages.size === fetchedImages.length) {
        selectAllBtn.textContent = 'Deselect All';
    } else {
        selectAllBtn.textContent = 'Select All';
    }
}

/**
 * Toggles select all / deselect all
 */
function toggleSelectAll() {
    const shouldSelectAll = selectedImages.size !== fetchedImages.length;

    document.querySelectorAll('.image-item').forEach(item => {
        const checkbox = item.querySelector('.image-checkbox');
        checkbox.checked = shouldSelectAll;
        toggleImageSelection(item, shouldSelectAll);
    });
}

/* ----------------------------
   Download Functions
   ---------------------------- */

/**
 * Downloads all fetched images as ZIP
 */
function downloadAll() {
    if (fetchedImages.length === 0) {
        showMessage('No images to download. Please fetch images first.', 'error');
        return;
    }

    const topic = document.getElementById('topic').value.trim();
    const imageUrls = fetchedImages.map(img => img.url);

    // Hide the topic input area when download starts
    const topicInput = document.getElementById('topic');
    const topicLabel = topicInput.closest('div').previousElementSibling || topicInput.closest('div');
    if (topicLabel && topicLabel.tagName === 'LABEL') {
        topicLabel.classList.add('hidden');
    }
    topicInput.closest('div').classList.add('hidden');
    
    // Also hide the Get Images button
    document.getElementById('fetch-button').closest('div').classList.add('hidden');
    
    // Hide the preview section
    document.getElementById('preview-section').classList.add('hidden');

    downloadImages(imageUrls, `${topic}_all_${Date.now()}`);
}

/**
 * Downloads selected images as ZIP
 */
function downloadSelected() {
    if (selectedImages.size === 0) {
        showMessage('No images selected. Please select at least one image.', 'error');
        return;
    }

    const topic = document.getElementById('topic').value.trim();

    // Hide the topic input area when download starts
    const topicInput = document.getElementById('topic');
    const topicLabel = topicInput.closest('div').previousElementSibling || topicInput.closest('div');
    if (topicLabel && topicLabel.tagName === 'LABEL') {
        topicLabel.classList.add('hidden');
    }
    topicInput.closest('div').classList.add('hidden');
    
    // Also hide the Get Images button
    document.getElementById('fetch-button').closest('div').classList.add('hidden');
    
    // Hide the preview section
    document.getElementById('preview-section').classList.add('hidden');

    downloadImages(Array.from(selectedImages), `${topic}_selected_${Date.now()}`);
}

/**
 * Helper function to download images via AJAX request
 */
function downloadImages(imageUrls, zipName) {
    // Disable the download buttons and fetch button during processing
    const downloadButton = document.getElementById('download-button');
    const downloadSelectedBtn = document.getElementById('download-selected-btn');
    const fetchButton = document.getElementById('fetch-button');
    
    if (downloadButton) downloadButton.disabled = true;
    if (downloadSelectedBtn) downloadSelectedBtn.disabled = true;
    if (fetchButton) fetchButton.disabled = true;
    
    // Show downloading animation
    const downloadControls = document.getElementById('download-controls');
    const originalHTML = downloadControls.innerHTML;

    downloadControls.innerHTML = `
        <div class="w-full text-center p-4">
            <div class="spinner"></div>
            <p class="mt-3 text-sm" style="color: #495464;">Preparing ZIP file...</p>
            <p class="mt-1 text-xs" style="color: #BBBFCA;">Processing ${imageUrls.length} images</p>
            <div class="progress-bar mt-2">
                <div class="progress-fill" id="download-progress-fill" style="width: 0%"></div>
            </div>
            <p class="mt-1 text-xs" style="color: #BBBFCA;" id="download-status">Initializing download...</p>
        </div>
    `;

    // Progress tracking
    let progress = 0;
    const progressFill = document.getElementById('download-progress-fill');
    const statusText = document.getElementById('download-status');
    
    // Realistic progress simulation
    const totalTime = 4000; // 4 seconds total
    const increment = 1;
    const intervalTime = totalTime / 100; // Update every 40ms for 100 increments
    
    // Status messages at key points
    const statusMessages = {
        10: "Connecting to server...",
        30: "Processing images...",
        60: "Creating ZIP archive...",
        85: "Finalizing download...",
        100: "ZIP Ready!"
    };
    
    const progressInterval = setInterval(() => {
        progress += increment;
        
        // Cap progress at 100%
        if (progress > 100) {
            progress = 100;
        }
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Update status message at key points
        if (statusMessages[progress]) {
            if (statusText) {
                statusText.textContent = statusMessages[progress];
            }
        }
        
        // Stop at 100%
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, intervalTime);

    // Create form data
    const formData = new FormData();
    formData.append('images_json', JSON.stringify({
        images: imageUrls,
        zipName: zipName
    }));

    // Use fetch API to create ZIP file
    fetch('api/create_zip.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Stop progress animation
            clearInterval(progressInterval);
            progress = 100;
            if (progressFill) {
                progressFill.style.width = '100%';
            }
            if (statusText) {
                statusText.textContent = "ZIP file ready!";
            }
            
            // Change UI to show download link
            setTimeout(() => {
                downloadControls.innerHTML = `
                    <div class="w-full text-center p-4">
                        <div class="text-3xl mb-3 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p class="mt-3 text-sm font-semibold" style="color: #495464;">${data.filename} is ready!</p>
                        <a href="${data.downloadUrl}" download="${data.filename}" 
                           class="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            Click here to download
                        </a>
                        <p class="mt-3 text-xs" style="color: #BBBFCA;">File will be saved to your downloads folder</p>
                        <button id="search-more-btn" class="mt-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Search More
                        </button>
                    </div>
                `;
                
                // Re-enable the buttons
                if (downloadButton) downloadButton.disabled = false;
                if (downloadSelectedBtn) downloadSelectedBtn.disabled = false;
                if (fetchButton) fetchButton.disabled = false;
                
                // Add event listener for Search More button
                const searchMoreBtn = document.getElementById('search-more-btn');
                if (searchMoreBtn) {
                    searchMoreBtn.addEventListener('click', function() {
                        // Simply refresh the page
                        location.reload();
                    });
                }
                
                showMessage('ZIP file created successfully! Click the download button to save it.', 'success');
            }, 500);
        } else {
            throw new Error(data.error || 'Failed to create ZIP file');
        }
    })
    .catch(error => {
        console.error('Download error:', error);
        
        // Stop progress animation
        clearInterval(progressInterval);
        
        // Re-enable the buttons
        if (downloadButton) downloadButton.disabled = false;
        if (downloadSelectedBtn) downloadSelectedBtn.disabled = false;
        if (fetchButton) fetchButton.disabled = false;
        
        // Show error message
        downloadControls.innerHTML = `
            <div class="w-full text-center p-4">
                <div class="text-3xl mb-3 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: #495464;">Failed to create ZIP file</p>
                <p class="mt-3 text-xs" style="color: #BBBFCA;">Please try again</p>
                <button id="search-more-btn-error" class="mt-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Search More
                </button>
            </div>
        `;
        
        // Add event listener for Search More button in error case
        const searchMoreBtnError = document.getElementById('search-more-btn-error');
        if (searchMoreBtnError) {
            searchMoreBtnError.addEventListener('click', function() {
                // Simply refresh the page
                location.reload();
            });
        }
        
        showMessage('Failed to create ZIP file. Please try again.', 'error');
    });
}

/* ----------------------------
   Main Logic Functions
   ---------------------------- */

/**
 * Fetches images from all APIs and displays them
 */
async function fetchImages() {
    const topic = document.getElementById('topic').value.trim();
    const limit = 30; // Fixed quantity

    if (!topic) {
        showMessage('Please enter a valid topic.', 'error');
        return;
    }

    // Reset state
    fetchedImages = [];
    selectedImages.clear();

    // Hide preview section and download controls
    document.getElementById('preview-section').classList.add('hidden');
    document.getElementById('download-controls').classList.add('hidden');

    // Set loading state with progress animation
    setLoading(true);
    animateProgress();

    try {
        const response = await fetch(`api/get_images.php?topic=${encodeURIComponent(topic)}&limit=${limit}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch images');
        }

        fetchedImages = data.images;

        setLoading(false);
        showMessage(`Successfully fetched ${data.count} images from multiple sources!`, 'success');

        // Show preview section and download controls with animation
        const previewSection = document.getElementById('preview-section');
        const downloadControls = document.getElementById('download-controls');

        previewSection.classList.remove('hidden');
        previewSection.classList.add('fade-in');

        downloadControls.classList.remove('hidden');
        downloadControls.classList.add('slide-up');

        // Attach event listeners to download buttons
        document.getElementById('download-button').addEventListener('click', downloadAll);
        document.getElementById('download-selected-btn').addEventListener('click', downloadSelected);

        renderImages();

    } catch (error) {
        setLoading(false);
        showMessage(`Error: ${error.message}`, 'error');
        console.error('Fetch error:', error);

        const preview = document.getElementById('image-preview');
        preview.innerHTML = `
            <div class="w-full text-center p-8">
                <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Error fetching images</h3>
                <p class="mt-1 text-sm text-gray-500">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Renders the fetched images in a grid with checkboxes
 */
function renderImages() {
    const preview = document.getElementById('image-preview');
    preview.classList.add('image-grid');

    preview.innerHTML = fetchedImages.map((img, index) => `
        <div class="image-item" data-index="${index}" data-url="${img.url}">
            <input type="checkbox" class="image-checkbox" data-index="${index}">
            <img src="${img.thumbnail}" alt="Image ${index + 1}" loading="lazy">
            <div class="image-overlay"></div>
        </div>
    `).join('');

    // Add click handlers
    preview.querySelectorAll('.image-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('image-checkbox')) return;
            const checkbox = item.querySelector('.image-checkbox');
            checkbox.checked = !checkbox.checked;
            toggleImageSelection(item, checkbox.checked);
        });
    });

    preview.querySelectorAll('.image-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const item = e.target.closest('.image-item');
            toggleImageSelection(item, e.target.checked);
        });
    });
}

/* ----------------------------
   Initialization
   ---------------------------- */

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log("Asset Bundler Pro: App loaded");

    const fetchButton = document.getElementById('fetch-button');
    const selectAllBtn = document.getElementById('select-all-btn');

    if (fetchButton) {
        fetchButton.addEventListener('click', fetchImages);
    }

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', toggleSelectAll);
    }
});