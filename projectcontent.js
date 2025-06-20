// Track the current index for each carousel project
const carouselIndexes = {};

// Function to scroll images in a specific carousel
function scrollImages(projectName, direction) {
  const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-image');
  if (!images.length) return;

  if (carouselIndexes[projectName] === undefined) {
    carouselIndexes[projectName] = 0;
  }

  images[carouselIndexes[projectName]].classList.remove('active');

  carouselIndexes[projectName] =
    (carouselIndexes[projectName] + direction + images.length) % images.length;

  images[carouselIndexes[projectName]].classList.add('active');
}

// Function to open project and scroll to it by hash
function openProjectFromHash() {
  const hash = window.location.hash;
  if (!hash) return;

  const targetHeading = document.querySelector(hash);
  if (!targetHeading) return;

  const projectDiv = targetHeading.closest('.project');
  if (!projectDiv) return;

  const header = projectDiv.querySelector('.project-header');
  const content = projectDiv.querySelector('.project-content');
  const icon = header.querySelector('.toggle-icon');

  if (content && !content.classList.contains('active')) {
    content.classList.add('active');
    header.classList.add('active');
    if (icon) icon.textContent = '▲';

    // Delay scrolling until after content expands
    setTimeout(() => {
      projectDiv.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  } else {
    // Already open, scroll immediately
    projectDiv.scrollIntoView({ behavior: 'smooth' });
  }

  // Reset carousels inside this project
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
      if (!content) return;

      content.classList.toggle('active');
      header.classList.toggle('active');

      const icon = header.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = icon.textContent === '▼' ? '▲' : '▼';
      }
    });
  });

  // Open project if URL has hash on page load
  openProjectFromHash();

  // Intercept sidebar nav link clicks so we can control scrolling and opening
  document.querySelectorAll('.sidebar-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetHash = link.getAttribute('href');

      if (history.pushState) {
        history.pushState(null, null, targetHash);
      } else {
        location.hash = targetHash;
      }

      openProjectFromHash();
    });
  });
});

// Also listen for hash changes (back/forward browser buttons)
window.addEventListener('hashchange', () => {
  openProjectFromHash();
});
