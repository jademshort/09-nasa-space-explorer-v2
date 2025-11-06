// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Get references to HTML elements we'll need
const getImageBtn = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery');

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
    
    // Determine what image to show (regular image or video thumbnail)
    let imageUrl;
    if (item.media_type === 'video' && item.thumbnail_url) {
      imageUrl = item.thumbnail_url;
    } else if (item.media_type === 'image') {
      imageUrl = item.url;
    } else {
      // Skip items without displayable images
      return;
    }
    
    // Create the HTML content for each gallery item
    galleryItem.innerHTML = `
      <img src="${imageUrl}" alt="${item.title}" style="cursor: pointer;">
      <p><strong>${item.title}</strong></p>
      <p>Date: ${item.date}</p>
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
  
  // Determine what content to show in modal
  let mediaContent;
  if (apodItem.media_type === 'video') {
    // For videos, embed the YouTube video
    mediaContent = `<iframe src="${apodItem.url}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
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