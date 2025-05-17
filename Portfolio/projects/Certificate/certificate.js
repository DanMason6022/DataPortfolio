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
function openZoom(src) {
  const overlay = document.getElementById('zoom-overlay');
  const zoomedImage = document.getElementById('zoomed-image');
  zoomedImage.src = src;
  overlay.classList.add('active');
}

function closeZoom() {
  const overlay = document.getElementById('zoom-overlay');
  overlay.classList.remove('active');
  document.getElementById('zoomed-image').src = '';
}
