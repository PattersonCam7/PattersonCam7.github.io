document.addEventListener('DOMContentLoaded', () => {
  // Collapsible project sections
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

  // Carousel state tracking
  const carouselIndexes = {};

  // Expose scrollImages globally for inline HTML use
  window.scrollImages = function (projectName, direction) {
    const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    if (!images.length) return;

    // Initialize index if needed
    if (carouselIndexes[projectName] === undefined) {
      carouselIndexes[projectName] = [...images].findIndex(img => img.classList.contains('active')) || 0;
    }

    // Remove active class
    images[carouselIndexes[projectName]].classList.remove('active');

    // Update index
    carouselIndexes[projectName] =
      (carouselIndexes[projectName] + direction + images.length) % images.length;

    // Add active class to the new image
    images[carouselIndexes[projectName]].classList.add('active');
  };
});
