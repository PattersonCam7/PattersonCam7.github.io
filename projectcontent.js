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

  if (images.length <= 1) {
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  } else {
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  if (carouselIndexes[projectName] === undefined) {
    carouselIndexes[projectName] = 0;
  } else {
    carouselIndexes[projectName] = Number(carouselIndexes[projectName]) || 0;
  }

  images[carouselIndexes[projectName]].classList.remove('active');

  carouselIndexes[projectName] =
    (carouselIndexes[projectName] + direction + images.length) % images.length;

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
  if (!targetHeading) return;

  const projectDiv = targetHeading.closest('.project-row');
  if (!projectDiv) return;

  const header = projectDiv.querySelector('.project-header');
  const content = projectDiv.querySelector('.project-content');
  const icon = header ? header.querySelector('.toggle-icon') : null;

  if (content && !content.classList.contains('active')) {
    content.classList.add('active');
    header.classList.add('active');
    if (icon) icon.textContent = '▲';

    setTimeout(() => {
      const headingRect = targetHeading.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + headingRect.top;
      const offset = window.innerHeight / 2;
      window.scrollTo({ top: absoluteElementTop - offset, behavior: 'smooth' });
    }, 150);
  } else {
    const headingRect = targetHeading.getBoundingClientRect();
    const absoluteElementTop = window.pageYOffset + headingRect.top;
    const offset = window.innerHeight / 2;
    window.scrollTo({ top: absoluteElementTop - offset, behavior: 'smooth' });
  }

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
  document.querySelectorAll('.collapsible').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content) return;
      content.classList.toggle('active');
      header.classList.toggle('active');
      const icon = header.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = content.classList.contains('active') ? '▲' : '▼';
      }
    });
  });

  document.querySelectorAll('.carousel').forEach(carousel => {
    const images = carousel.querySelectorAll('.carousel-image');
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');
    if (images.length <= 1) {
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
    }
  });

  openProjectFromHash();

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

// === Lightbox Setup ===
// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('lightbox-close');

// Open lightbox on image click
document.querySelectorAll('.carousel-image').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  });
});

// Close lightbox function
function closeLightbox() {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
  document.body.style.overflow = ''; // restore scroll
}

// Close lightbox on close button click
if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox);
} else {
  console.warn('Close button #lightbox-close not found in DOM.');
}


// Close lightbox on clicking outside image
lightbox.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lightboxImg) {
    closeLightbox();
  }
});

// Close lightbox on ESC key press
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
    closeLightbox();
  }
});

// === End of Lightbox Setup ===


