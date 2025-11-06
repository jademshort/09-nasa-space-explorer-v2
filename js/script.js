// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Get references to HTML elements we'll need
const getImageBtn = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery');
const spaceFactElement = document.getElementById('spaceFact');

// Array of fun space facts
const spaceFacts = [
  "Giant, spinning storms on Neptune are big enough to swallow the whole Earth!",
  "The average temperature on Venus is more than 480 degrees Celsius (about 900 degrees Fahrenheit) — hotter than a self-cleaning oven.",
  "If you could stand at the Martian equator, the temperature at your feet would be like a warm spring day, but at your head it would be freezing cold!",
  "Saturn is the only planet in our solar system that is less dense than water. It could float in a bathtub if anybody could build a bathtub big enough.",
  "More than 1,300 Earths would fit into Jupiter's vast sphere."
];

// Function to display a random space fact
function displayRandomFact() {
  // Pick a random number between 0 and the length of our facts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  
  // Get the fact at that random position
  const randomFact = spaceFacts[randomIndex];
  
  // Display the random fact on the page
  spaceFactElement.textContent = randomFact;
}

// Display a random fact when the page loads
displayRandomFact();

// Add event listener to the button
getImageBtn.addEventListener('click', fetchAndDisplayImages);

// Function to fetch images from NASA API
async function fetchAndDisplayImages() {
  try {
    // Show loading message
    gallery.innerHTML = '<div class="placeholder"><p>Loading space images...</p></div>';
    
    // Fetch data from the API
    const response = await fetch(apodData);
    const data = await response.json();
    
    // Clear the gallery and display images
    displayGallery(data);
    
  } catch (error) {
    // Show error message if something goes wrong
    gallery.innerHTML = '<div class="placeholder"><p>Sorry, could not load images. Please try again.</p></div>';
    console.error('Error fetching data:', error);
  }
}

// Function to create and display the gallery
function displayGallery(apodArray) {
  // Clear the gallery
  gallery.innerHTML = '';
  
  // Loop through each APOD item and create gallery items
  apodArray.forEach(item => {
    // Create a container for each gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Handle different media types (images vs videos)
    let imageUrl;
    let mediaTypeIndicator = '';
    
    if (item.media_type === 'video') {
      // Check if there's a thumbnail for the video
      if (item.thumbnail_url) {
        imageUrl = item.thumbnail_url;
      } else {
        // If no thumbnail, create a placeholder for video
        imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaWNrIHRvIFdhdGNoIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      }
      // Add a play button indicator for videos
      mediaTypeIndicator = '<div class="video-indicator">▶ Video</div>';
    } else if (item.media_type === 'image') {
      imageUrl = item.url;
    } else {
      // Skip items that are neither images nor videos
      return;
    }
    
    // Create the HTML content for each gallery item
    galleryItem.innerHTML = `
      <div class="gallery-image-container">
        <img src="${imageUrl}" alt="${item.title}" style="cursor: pointer;">
        ${mediaTypeIndicator}
      </div>
      <p><strong>${item.title}</strong></p>
      <p>Date: ${item.date}</p>
      <p class="media-type">Type: ${item.media_type === 'video' ? '🎥 Video' : '🖼️ Image'}</p>
    `;
    
    // Add click event to open modal when image is clicked
    galleryItem.addEventListener('click', () => openModal(item));
    
    // Add the item to the gallery
    gallery.appendChild(galleryItem);
  });
}

// Function to open modal with detailed information
function openModal(apodItem) {
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Handle different media types in the modal
  let mediaContent;
  if (apodItem.media_type === 'video') {
    // Check if it's a YouTube video and embed it
    if (apodItem.url && apodItem.url.includes('youtube.com')) {
      // Convert YouTube URL to embed format
      const videoId = apodItem.url.match(/v=([^&]+)/);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
        mediaContent = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
      } else {
        // If we can't parse the YouTube URL, show a link
        mediaContent = `
          <div class="video-link">
            <p>🎥 <strong>Watch this space video:</strong></p>
            <a href="${apodItem.url}" target="_blank" class="video-button">Open Video in New Tab</a>
          </div>
        `;
      }
    } else {
      // For other video types, provide a link
      mediaContent = `
        <div class="video-link">
          <p>🎥 <strong>Watch this space video:</strong></p>
          <a href="${apodItem.url}" target="_blank" class="video-button">Open Video in New Tab</a>
        </div>
      `;
    }
  } else {
    // For images, show the high-resolution version if available
    const imageUrl = apodItem.hdurl || apodItem.url;
    mediaContent = `<img src="${imageUrl}" alt="${apodItem.title}" style="max-width: 100%; height: auto;">`;
  }
  
  // Create modal content
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${apodItem.title}</h2>
      <p><strong>Date:</strong> ${apodItem.date}</p>
      <p><strong>Type:</strong> ${apodItem.media_type === 'video' ? '🎥 Video' : '🖼️ Image'}</p>
      ${mediaContent}
      <p><strong>Description:</strong> ${apodItem.explanation}</p>
      ${apodItem.copyright ? `<p><strong>Copyright:</strong> ${apodItem.copyright}</p>` : ''}
    </div>
  `;
  
  // Add modal to the page
  document.body.appendChild(modal);
  
  // Add event listener to close button
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => closeModal(modal));
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function escapeClose(e) {
    if (e.key === 'Escape') {
      closeModal(modal);
      document.removeEventListener('keydown', escapeClose);
    }
  });
}

// Function to close and remove modal
function closeModal(modal) {
  modal.remove();
}