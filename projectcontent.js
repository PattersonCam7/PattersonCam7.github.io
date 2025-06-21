// Track the current index for each carousel project
const carouselIndexes = {};

// Function to scroll images in a specific carousel
function scrollImages(projectName, direction) {
  const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
  if (!carousel) {
    console.error(`Carousel not found for project: ${projectName}`);
    return;
  }

  const images = carousel.querySelectorAll('.carousel-image');
  if (!images.length) {
    console.error(`No images found in carousel for project: ${projectName}`);
    return;
  }

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

// Function to open project from hash and scroll with offset
function openProjectFromHash() {
  const hash = window.location.hash;
  if (!hash) return;

  const targetHeading = document.querySelector(hash);
  if (!targetHeading) {
    console.warn(`No element found for hash: ${hash}`);
    return;
  }

  const projectDiv = targetHeading.closest('.project-row');
  if (!projectDiv) {
    console.warn(`No .project-row found for hash: ${hash}`);
    return;
  }

  const header = projectDiv.querySelector('.project-header');
  const content = projectDiv.querySelector('.project-content');
  const icon = header ? header.querySelector('.toggle-icon') : null;

  if (content && !content.classList.contains('active')) {
    content.classList.add('active');
    header.classList.add('active');
    if (icon) icon.textContent = '▲';

    // Delay scrolling until after content expands
    setTimeout(() => {
      const headingRect = targetHeading.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + headingRect.top;
      const offset = window.innerHeight / 2; // Center roughly halfway down

      window.scrollTo({
        top: absoluteElementTop - offset,
        behavior: 'smooth'
      });
    }, 150);
  } else {
    // Already open, scroll immediately with offset
    const headingRect = targetHeading.getBoundingClientRect();
    const absoluteElementTop = window.pageYOffset + headingRect.top;
    const offset = window.innerHeight / 2;

    window.scrollTo({
      top: absoluteElementTop - offset,
      behavior: 'smooth'
    });
  }

  // Reset carousel(s) inside this project to show first image active
  const carousels = projectDiv.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    const projectName = carousel.getAttribute('data-project');
    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length) {
      images.forEach(img => img.classList.remove('active'));
      images[0].classList.add('active');
      carouselIndexes[projectName] = 0;
    }
  });
}

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Handle collapsible project sections
  document.querySelectorAll('.collapsible').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content) {
        console.error('No content found for collapsible header');
        return;
      }

      // Toggle visibility
      content.classList.toggle('active');
      header.classList.toggle('active');

      // Toggle icon direction
      const icon = header.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = content.classList.contains('active') ? '▲' : '▼';
      } else {
        console.warn('Toggle icon not found');
      }
    });
  });

  // Open project on initial page load if hash present
  openProjectFromHash();

  // Add event listeners for carousel buttons (optional enhancement)
  document.querySelectorAll('.carousel-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const carousel = button.closest('.carousel');
      const projectName = carousel.getAttribute('data-project');
      const direction = button.classList.contains('next') ? 1 : -1;
      scrollImages(projectName, direction);
    });
  });
});

// Listen for hash changes when clicking sidebar links or manual changes
window.addEventListener('hashchange', () => {
  openProjectFromHash();
});