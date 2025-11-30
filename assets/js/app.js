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
  document.getElementById('download-button').disabled = isLoading || fetchedImages.length === 0;
  document.getElementById('loading-indicator').classList.toggle('hidden', !isLoading);

  const fetchButton = document.getElementById('fetch-button');
  fetchButton.innerHTML = isLoading
    ? '<svg class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Loading...</span>'
    : '<svg id="fetch-icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span>Get Images</span>';
}

/**
 * Displays status messages to the user.
 * @param {string} message 
 * @param {string} type 
 */
function showMessage(message, type = 'info') {
  const box = document.getElementById('message-box');
  box.textContent = message;
  box.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800', 'bg-blue-100', 'text-blue-800');

  if (type === 'error') {
    box.classList.add('bg-red-100', 'text-red-800');
  } else if (type === 'success') {
    box.classList.add('bg-green-100', 'text-green-800');
  } else {
    box.classList.add('bg-blue-100', 'text-blue-800');
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

  // Set loading state
  clearPreview();
  setLoading(true);
  showMessage(`Fetching ${limit} images for '${topic}' from all APIs...`, 'info');

  try {
    const response = await fetch(`api/get_images.php?topic=${encodeURIComponent(topic)}&limit=${limit}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch images');
    }

    fetchedImages = data.images;
    renderImages();

    setLoading(false);
    showMessage(`Successfully fetched ${data.count} images from multiple sources!`, 'success');
    document.getElementById('download-button').disabled = false;
    document.getElementById('selection-controls').classList.remove('hidden');

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
  preview.classList.remove('flex', 'justify-center', 'items-center', 'bg-gray-200');
  preview.classList.add('image-grid', 'p-4');

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

  downloadSelectedBtn.disabled = selectedImages.size === 0;

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
  showMessage('Preparing ZIP file... This may take a moment.', 'info');

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

  // Clean up
  setTimeout(() => {
    document.body.removeChild(form);
    showMessage('Download started! Check your downloads folder.', 'success');
  }, 1000);
}


// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  console.log("Asset Bundler Pro: App loaded");

  const fetchButton = document.getElementById('fetch-button');
  const downloadButton = document.getElementById('download-button');
  const downloadSelectedBtn = document.getElementById('download-selected-btn');
  const selectAllBtn = document.getElementById('select-all-btn');

  if (fetchButton) {
    fetchButton.addEventListener('click', fetchImages);
  }

  if (downloadButton) {
    downloadButton.addEventListener('click', downloadAll);
    downloadButton.disabled = true;
  }

  if (downloadSelectedBtn) {
    downloadSelectedBtn.addEventListener('click', downloadSelected);
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', toggleSelectAll);
  }
});
