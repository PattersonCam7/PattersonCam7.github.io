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

  // Carousel logic
  const carouselIndexes = {};

  window.scrollImages = function (projectName, direction) {
    const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;

    if (carouselIndexes[projectName] === undefined) {
      // Find current active index
      carouselIndexes[projectName] = [...images].findIndex(img => img.classList.contains('active')) || 0;
    }

    images[carouselIndexes[projectName]].classList.remove('active');

    carouselIndexes[projectName] =
      (carouselIndexes[projectName] + direction + images.length) % images.length;

    images[carouselIndexes[projectName]].classList.add('active');
  };
});