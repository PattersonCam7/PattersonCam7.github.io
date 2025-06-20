// Track the current index for each carousel project
const carouselIndexes = {};

// Function to scroll images in a specific carousel
function scrollImages(projectName, direction) {
  const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-image');
  if (!images.length) return;

  // Initialize index for this project if not set
  if (carouselIndexes[projectName] === undefined) {
    carouselIndexes[projectName] = 0;
  }

  // Remove 'active' class from current image
  images[carouselIndexes[projectName]].classList.remove('active');

  // Calculate new index (wraps around)
  carouselIndexes[projectName] =
    (carouselIndexes[projectName] + direction + images.length) % images.length;

  // Add 'active' class to new image
  images[carouselIndexes[projectName]].classList.add('active');
}

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Handle collapsible project sections
  document.querySelectorAll('.collapsible').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content) return;

      // Toggle visibility
      content.classList.toggle('active');
      header.classList.toggle('active');

      // Toggle icon direction
      const icon = header.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = icon.textContent === '▼' ? '▲' : '▼';
      }
    });
  });

  // Auto-open project if URL has hash on page load
  const hash = window.location.hash;
  if (hash) {
    // Remove the '#' to get the ID
    const targetId = hash.substring(1);
    const targetProject = document.getElementById(targetId);
    if (targetProject) {
      // Get the header and content elements inside the project div
      const header = targetProject.querySelector('.project-header');
      const content = targetProject.querySelector('.project-content');
      const icon = header.querySelector('.toggle-icon');

      // If not already active, toggle classes and icon
      if (content && !content.classList.contains('active')) {
        content.classList.add('active');
        header.classList.add('active');
        if (icon) {
          icon.textContent = '▲'; // open icon
        }
      }

      // Scroll smoothly to the project
      targetProject.scrollIntoView({ behavior: 'smooth' });
    }
  }
});
