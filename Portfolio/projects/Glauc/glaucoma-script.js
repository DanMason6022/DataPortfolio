// CSV Loading Function
function loadCSV(file, tableId) {
    Papa.parse(file, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            displayData(results.data, tableId);
            // Initialize controls for this specific table after loading
            initTableControls(tableId);
        },
        error: function(error) {
            console.error("Error loading CSV:", error);
        }
    });
}

// Display Data in Tables
function displayData(data, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Clear existing data
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length > 0) {
        // Create headers
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create rows
        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value !== undefined ? value : '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
}

// Initialize controls for a specific table
function initTableControls(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const wrapper = table.closest('.table-wrapper');
    const controls = wrapper ? wrapper.previousElementSibling : null;
    
    if (!controls || !controls.classList.contains('table-controls')) return;


    // Download button
    const downloadBtn = controls.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const tableName = this.getAttribute('data-name') || tableId;
            downloadTableAsCSV(tableId, tableName);
        });
    }
}

// Download table as CSV
function downloadTableAsCSV(tableId, tableName) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tr');
    let csvContent = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('th').forEach(th => {
        headers.push(th.textContent);
    });
    csvContent.push(headers.join(','));
    
    // Get rows
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(td => {
            rowData.push(`"${td.textContent.replace(/"/g, '""')}"`);
        });
        if (rowData.length > 0) {
            csvContent.push(rowData.join(','));
        }
    });
    
    // Create download
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Toggle Code Visibility
document.getElementById('toggle-code')?.addEventListener('click', function() {
    const codeContainer = document.getElementById('code-container');
    if (codeContainer) {
        codeContainer.style.display = codeContainer.style.display === 'none' ? 'block' : 'none';
        this.textContent = codeContainer.style.display === 'none' ? 'Show Cleaning Code' : 'Hide Code';
    }
});

// Load Python Code
fetch('/projects/Glauc/glauc documents/Problem2.py')
    .then(response => response.text())
    .then(code => {
        const codeElement = document.getElementById('python-code');
        if (codeElement) {
            codeElement.textContent = code;
        }
    })
    .catch(error => {
        console.error('Error loading Python code:', error);
    });

// Initialize Page
window.addEventListener('DOMContentLoaded', function() {
    // Load all CSVs
    loadCSV("/projects/Glauc/glauc documents/os.csv", "data-table1");
    loadCSV("/projects/Glauc/glauc documents/od1.csv", "data-table2");
    loadCSV("/projects/Glauc/glauc documents/od2.csv", "data-table3");
    loadCSV("/projects/Glauc/glauc documents/od_cleaned.csv", "data-table4");

    // Smooth Scrolling (excluding home button)
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

document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-toggle').checked = false;
  });
});
