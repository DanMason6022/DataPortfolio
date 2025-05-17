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


// Image zoom functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create zoom container
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'image-zoom-container';
    document.body.appendChild(zoomContainer);
    
    // Add zoomable class to all images (except those in PDF viewer)
    const images = document.querySelectorAll('img:not(.pdf-viewer img)');
    images.forEach(img => {
        img.classList.add('zoomable-image');
        img.addEventListener('click', function() {
            const zoomImg = document.createElement('img');
            zoomImg.src = this.src;
            zoomImg.alt = this.alt;
            
            // Clear previous content
            while (zoomContainer.firstChild) {
                zoomContainer.removeChild(zoomContainer.firstChild);
            }
            
            zoomContainer.appendChild(zoomImg);
            zoomContainer.classList.add('active');
        });
    });
    
    // Close zoom when clicking
    zoomContainer.addEventListener('click', function() {
        this.classList.remove('active');
    });
});