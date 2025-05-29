document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        if (!anchor.getAttribute('href').includes('index.html')) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});

// Toggle R Code Visibility
document.getElementById('toggle-r-code')?.addEventListener('click', function () {
  const codeContainer = document.getElementById('r-code-container');
  const codeElement = document.getElementById('r-code');

  const isVisible = codeContainer.style.display === 'block';
  codeContainer.style.display = isVisible ? 'none' : 'block';
  this.textContent = isVisible ? 'Show R Cleaning Code' : 'Hide R Cleaning Code';

  // Fetch only once
  if (!codeElement.textContent.trim()) {
    fetch("documents/Load_data.R")
      .then(response => response.text())
      .then(data => {
        codeElement.textContent = data;
      })
      .catch(err => {
        codeElement.textContent = 'Failed to load R code.';
        console.error(err);
      });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const zoomContainer = document.createElement('div');
  zoomContainer.className = 'image-zoom-container';
  document.body.appendChild(zoomContainer);

  zoomContainer.addEventListener('click', () => {
    zoomContainer.classList.remove('active');
    zoomContainer.innerHTML = '';
  });
});

function openZoom(src) {
  const zoomContainer = document.querySelector('.image-zoom-container');
  if (zoomContainer) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Zoomed Image';

    zoomContainer.innerHTML = '';
    zoomContainer.appendChild(img);
    zoomContainer.classList.add('active');
  }
}

