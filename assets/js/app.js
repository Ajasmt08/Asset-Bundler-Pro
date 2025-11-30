// Global variables
let fetchedImages = [];
let selectedImages = new Set();

// --- UTILITY FUNCTIONS ---

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
    fetchButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Loading...</span>';
    progressFill.style.width = '0%';
  } else {
    fetchButton.innerHTML = '<svg id="fetch-icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span>Get Images</span>';

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

  // Remove all color classes
  box.style.backgroundColor = '';
  box.style.color = '';
  box.style.border = '';

  if (type === 'error') {
    box.style.backgroundColor = '#E8E8E8';
    box.style.color = '#495464';
    box.style.border = '2px solid #495464';
  } else if (type === 'success') {
    box.style.backgroundColor = '#F4F4F2';
    box.style.color = '#495464';
    box.style.border = '2px solid #BBBFCA';
  } else {
    box.style.backgroundColor = '#E8E8E8';
    box.style.color = '#495464';
    box.style.border = '2px solid #BBBFCA';
  }
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

// --- MAIN LOGIC ---

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

  downloadImages(Array.from(selectedImages), `${topic}_selected_${Date.now()}`);
}

/**
 * Helper function to download images via POST request using form submission
 */
function downloadImages(imageUrls, zipName) {
  // Show downloading animation
  const downloadControls = document.getElementById('download-controls');
  const originalHTML = downloadControls.innerHTML;

  downloadControls.innerHTML = `
    <div class="w-full text-center p-4">
      <div class="spinner"></div>
      <p class="mt-3 text-sm" style="color: #495464;">Preparing ZIP file...</p>
      <p class="mt-1 text-xs" style="color: #BBBFCA;">Downloading ${imageUrls.length} images</p>
      <div class="progress-bar mt-2">
        <div class="progress-fill" id="download-progress-fill" style="width: 0%"></div>
      </div>
    </div>
  `;

  // Animate download progress
  let downloadProgress = 0;
  const downloadInterval = setInterval(() => {
    downloadProgress += Math.random() * 8; // Slower progress increment
    if (downloadProgress > 90) downloadProgress = 90; // Stop at 90%

    const progressFill = document.getElementById('download-progress-fill');
    if (progressFill) {
      progressFill.style.width = downloadProgress + '%';
    }
  }, 400); // Slower interval

  // Create a hidden form
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'api/download.php';
  form.style.display = 'none';

  // Add images as JSON in a hidden input
  const imagesInput = document.createElement('input');
  imagesInput.type = 'hidden';
  imagesInput.name = 'images_json';
  imagesInput.value = JSON.stringify({
    images: imageUrls,
    zipName: zipName
  });

  form.appendChild(imagesInput);
  document.body.appendChild(form);

  // Submit the form
  form.submit();

  // Clean up and restore UI - increased timeout to 5 seconds
  setTimeout(() => {
    clearInterval(downloadInterval);

    // Complete progress
    const progressFill = document.getElementById('download-progress-fill');
    if (progressFill) {
      progressFill.style.width = '100%';
    }

    setTimeout(() => {
      document.body.removeChild(form);
      downloadControls.innerHTML = originalHTML;

      // Re-attach event listeners
      document.getElementById('download-button').addEventListener('click', downloadAll);
      document.getElementById('download-selected-btn').addEventListener('click', downloadSelected);

      showMessage('Download started! Check your downloads folder.', 'success');
    }, 800);
  }, 5000); // Increased from 2000ms to 5000ms
}


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
