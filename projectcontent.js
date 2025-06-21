// Track the current index for each carousel project
const carouselIndexes = {};

/**
 * Scrolls images in the specified carousel by updating active image index.
 * @param {string} projectName - The data-project attribute of the carousel.
 * @param {number} direction - +1 for next image, -1 for previous image.
 */
function scrollImages(projectName, direction) {
  const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
  if (!carousel) {
    console.error(`Carousel not found for project: ${projectName}`);
    return;
  }

  const images = carousel.querySelectorAll('.carousel-image');
  const prevBtn = carousel.querySelector('.carousel-button.prev');
  const nextBtn = carousel.querySelector('.carousel-button.next');

  console.log('Current index before:', carouselIndexes[projectName]);
  console.log('Images length:', images.length);

  // Disable buttons if carousel has 1 or 0 images, else enable
  if (images.length <= 1) {
    console.log(`Carousel for "${projectName}" has ${images.length} image(s); no scrolling needed.`);
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  } else {
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  // Ensure index is initialized and a number
  if (carouselIndexes[projectName] === undefined) {
    carouselIndexes[projectName] = 0;
  } else {
    carouselIndexes[projectName] = Number(carouselIndexes[projectName]) || 0;
  }

  // Remove 'active' class from current image
  images[carouselIndexes[projectName]].classList.remove('active');

  // Calculate new index with wrap-around
  console.log('Before update:', carouselIndexes[projectName], direction, images.length);
  carouselIndexes[projectName] =
    (carouselIndexes[projectName] + direction + images.length) % images.length;
  console.log('After update:', carouselIndexes[projectName]);

  // Add 'active' class to new image
  images[carouselIndexes[projectName]].classList.add('active');
}

/**
 * Opens a project section from the URL hash, expands it, scrolls to it,
 * and resets any carousels inside to the first image.
 */
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

    // Scroll after expanding to center heading
    setTimeout(() => {
      const headingRect = targetHeading.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + headingRect.top;
      const offset = window.innerHeight / 2;

      window.scrollTo({
        top: absoluteElementTop - offset,
        behavior: 'smooth'
      });
    }, 150);
  } else {
    // If already expanded, scroll immediately
    const headingRect = targetHeading.getBoundingClientRect();
    const absoluteElementTop = window.pageYOffset + headingRect.top;
    const offset = window.innerHeight / 2;

    window.scrollTo({
      top: absoluteElementTop - offset,
      behavior: 'smooth'
    });
  }

  // Reset carousels inside project to first image and update buttons
  const carousels = projectDiv.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    const projectName = carousel.getAttribute('data-project');
    const images = carousel.querySelectorAll('.carousel-image');
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');

    if (images.length) {
      images.forEach(img => img.classList.remove('active'));
      images[0].classList.add('active');
      carouselIndexes[projectName] = 0;

      if (images.length <= 1) {
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      } else {
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Setup collapsible project sections toggle
  document.querySelectorAll('.collapsible').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content) {
        console.error('No content found for collapsible header');
        return;
      }
      content.classList.toggle('active');
      header.classList.toggle('active');

      const icon = header.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = content.classList.contains('active') ? '▲' : '▼';
      } else {
        console.warn('Toggle icon not found');
      }
    });
  });

  // Disable buttons on carousels with 0 or 1 image
  document.querySelectorAll('.carousel').forEach(carousel => {
    const projectName = carousel.getAttribute('data-project');
    const images = carousel.querySelectorAll('.carousel-image');
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');

    if (images.length <= 1) {
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
    }
  });

  // Open project on initial page load if hash present
  openProjectFromHash();

  // Add click listeners for carousel buttons
  document.querySelectorAll('.carousel-button').forEach(button => {
    button.addEventListener('click', () => {
      const carousel = button.closest('.carousel');
      const projectName = carousel.getAttribute('data-project');
      const direction = button.classList.contains('next') ? 1 : -1;
      scrollImages(projectName, direction);
    });
  });
});

window.addEventListener('hashchange', openProjectFromHash);
