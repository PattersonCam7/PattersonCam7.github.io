// Collapsible project sections
document.querySelectorAll('.collapsible').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    if (!content) return;

    content.classList.toggle('active');
    header.classList.toggle('active');  // fixed typo here: classList

    const icon = header.querySelector('.toggle-icon');
    if (icon) {
      icon.textContent = icon.textContent === '▼' ? '▲' : '▼';
    }
  });
});

// Carousel scrolling
const carouselIndexes = {};

function scrollImages(projectName, direction) {
  const carousel = document.querySelector(`.carousel[data-project="${projectName}"]`);
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-image');
  if (!carouselIndexes[projectName]) {
    carouselIndexes[projectName] = 0;
  }

  images[carouselIndexes[projectName]].classList.remove('active');
  carouselIndexes[projectName] = (carouselIndexes[projectName] + direction + images.length) % images.length;
  images[carouselIndexes[projectName]].classList.add('active');
}
