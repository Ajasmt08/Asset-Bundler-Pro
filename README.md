# Asset Bundler Pro

Asset Bundler Pro is a web application that allows users to search for and download images from multiple stock photo APIs (Pexels, Pixabay, and Unsplash) in a single interface. The application fetches images from all three sources, displays them in a grid, and allows users to download selected images as a ZIP file.

## Features

- Search for images across multiple stock photo APIs simultaneously
- Fetch images from Pexels, Pixabay, and Unsplash
- Preview images in a responsive grid layout
- Select individual images or download all images
- Create ZIP archives of selected images
- Clean, modern user interface with smooth animations

## How It Works

1. Enter a search term in the input field
2. Click "Get Images" to fetch 30 images from multiple sources
3. Browse and select the images you want to download
4. Click "Download All" or "Download Selected" to create a ZIP file
5. Click the download link to save the ZIP file to your computer

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
- **Backend**: PHP 7+
- **APIs**: Pexels, Pixabay, Unsplash
- **Libraries**: cURL (for API requests), ZipArchive (for ZIP creation)

## Project Structure

```
Asset Bundler Pro/
├── api/
│   ├── get_images.php     # Fetches images from stock photo APIs
│   ├── create_zip.php     # Creates ZIP files and saves them
│   └── download.php       # Handles immediate downloads
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── js/
│       └── app.js         # Main application logic
├── downloads/             # Generated ZIP files are stored here
├── includes/
│   ├── AssetBundler.php   # Main class for image handling and ZIP creation
│   └── config.php         # API configuration
├── index.php              # Main application page
└── README.md              # This file
```

## Setup Instructions

1. Clone or download the repository
2. Ensure you have a web server with PHP 7+ installed
3. Configure your API keys in `includes/config.php`:
   - Pexels API key
   - Pixabay API key
   - Unsplash API key
4. Make sure the `downloads/` directory is writable
5. Start your web server and navigate to the project directory

## Usage

1. Open the application in your web browser
2. Enter a search term (e.g., "nature", "technology", "food")
3. Click "Get Images" to fetch results
4. Select images by clicking on them or using the checkboxes
5. Use "Select All" to select all displayed images
6. Click "Download All" to download all images or "Download Selected" for specific images
7. When the ZIP file is ready, click the download button to save it

## Author

Asset Bundler Pro

## License

This project is open source and available under the MIT License.