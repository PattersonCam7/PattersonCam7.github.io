// Track the current index for each carousel project
const carouselIndexes = {};

/**
 * Scrolls images in the specified carousel by updating active image index.
 * @param {string} projectName - The data-project attribute of the carousel.
 * @param {number} direction - +1 for next image, -1 for previous image.
 */
function scrollImages(projectName, direction) {
  const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-image');
  const prevBtn = carousel.querySelector('.carousel-button.prev');
  const nextBtn = carousel.querySelector('.carousel-button.next');

  if (images.length <= 1) {
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  if (prevBtn) prevBtn.disabled = false;
  if (nextBtn) nextBtn.disabled = false;

  if (carouselIndexes[projectName] === undefined) {
    carouselIndexes[projectName] = 0;
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
  // Collapsible project sections toggle
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

  // Disable buttons on carousels with <=1 image
  document.querySelectorAll('.carousel').forEach(carousel => {
    const images = carousel.querySelectorAll('.carousel-image');
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');
    if (images.length <= 1) {
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
    }
  });

  // Open project on initial load if hash present
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

  // === Lightbox Setup ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.carousel-image').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || e.target === lightboxImg) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  } else {
    console.warn('#lightbox or #lightbox-img not found in DOM.');
  }

  // Listen to hash changes to auto-open projects
  window.addEventListener('hashchange', openProjectFromHash);
});
