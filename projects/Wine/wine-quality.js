// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initSortableTables();
    initModelToggle();
});

// Table Sorting Functionality (unchanged)
// Table Sorting Functionality (modified to skip model evaluation tables)
function initSortableTables() {
    document.querySelectorAll('table').forEach(table => {
        // Skip tables inside #random-forest and #xgboost sections
        if (table.closest('#random-forest') || table.closest('#xgboost')) {
            return;
        }
        
        const headers = table.querySelectorAll('th');
        
        headers.forEach((header, index) => {
            header.classList.add('sortable');
            header.style.cursor = 'pointer';
            
            header.addEventListener('click', () => {
                sortTable(table, index);
                updateSortIndicator(table, index);
            });
        });
    });
}

function sortTable(table, column) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = table.getAttribute('data-sort-dir') === 'asc';
    const isNumeric = !isNaN(parseFloat(rows[0]?.children[column]?.textContent));
    
    rows.sort((a, b) => {
        const aVal = a.children[column].textContent.trim();
        const bVal = b.children[column].textContent.trim();
        
        if (isNumeric) {
            return isAsc 
                ? parseFloat(aVal) - parseFloat(bVal)
                : parseFloat(bVal) - parseFloat(aVal);
        } else {
            return isAsc 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    table.setAttribute('data-sort-dir', isAsc ? 'desc' : 'asc');
}

function updateSortIndicator(table, column) {
    table.querySelectorAll('th').forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });
    
    const header = table.querySelectorAll('th')[column];
    const isAsc = table.getAttribute('data-sort-dir') === 'asc';
    header.classList.add(isAsc ? 'sort-asc' : 'sort-desc');
}

function initModelToggle() {
    const buttons = document.querySelectorAll('.toggle-button');
    const contents = document.querySelectorAll('.model-results');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Get which content to show from data attribute
            const contentToShow = this.getAttribute('data-target');
            
            // Remove active class from all buttons and hide all contents
            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show the corresponding content
            const targetContent = document.getElementById(contentToShow);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
            } else {
                console.error('Could not find content with ID:', contentToShow);
            }
        });
    });
    
    // Initialize by showing first content if none are active
    const hasActive = Array.from(contents).some(c => c.classList.contains('active'));
    if (!hasActive && buttons.length > 0) {
        const firstContentId = buttons[0].getAttribute('data-target');
        const firstContent = document.getElementById(firstContentId);
        if (firstContent) {
            buttons[0].classList.add('active');
            firstContent.classList.add('active');
            firstContent.style.display = 'block';
        }
    }
}

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