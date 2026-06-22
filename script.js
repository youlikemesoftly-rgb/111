const slides = [...document.querySelectorAll('#logic-v6 .slide')];
const progressText = document.querySelector('#progressText');
const progressFill = document.querySelector('#progressFill');
const navLinks = [...document.querySelectorAll('.nav a')];
const themeToggle = document.querySelector('#themeToggle');
const printBtn = document.querySelector('#printBtn');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');

const savedTheme = localStorage.getItem('codex-share-theme');
if (savedTheme === 'dark') {
  document.documentElement.dataset.theme = 'dark';
  themeToggle.textContent = '浅色';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? '' : 'dark';
  themeToggle.textContent = isDark ? '深色' : '浅色';
  localStorage.setItem('codex-share-theme', isDark ? 'light' : 'dark');
});

printBtn.addEventListener('click', () => window.print());

const updateProgress = () => {
  const viewportMiddle = window.scrollY + window.innerHeight * 0.48;
  let current = 0;
  slides.forEach((slide, index) => {
    if (slide.offsetTop <= viewportMiddle) current = index;
  });
  const value = current + 1;
  progressText.textContent = `${value} / ${slides.length}`;
  progressFill.style.width = `${value / slides.length * 100}%`;
  navLinks.forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    link.classList.toggle('active', target && target.offsetTop <= viewportMiddle && target.offsetTop + target.offsetHeight > viewportMiddle);
  });
};

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.18 });

slides.forEach(slide => revealObserver.observe(slide));
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

document.querySelectorAll('figure img').forEach(image => {
  image.addEventListener('click', () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
    lightbox.showModal();
  });
});

lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
