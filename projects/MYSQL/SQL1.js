    function setupTableau(id, dashboardName) {
      var divElement = document.getElementById(id);
      var vizElement = divElement.getElementsByTagName('object')[0];
      vizElement.setAttribute("name", dashboardName);
      if (divElement.offsetWidth > 800) {
        vizElement.style.width = '1200px';
        vizElement.style.height = '900px';
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = '100%';
        vizElement.style.height = '900px';
      } else {
        vizElement.style.width = '100%';
        vizElement.style.height = '1200px';
      }
      var scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
    }
    setupTableau('vizTask1', 'YOUR_TASK1_DASHBOARD_NAME');
    setupTableau('vizTask2', 'YOUR_TASK2_DASHBOARD_NAME');
    setupTableau('vizTask3', 'YOUR_TASK3_DASHBOARD_NAME');


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

function toggleSQLCode(id) {
  const container = document.getElementById(`code-container${typeof id === 'string' ? id.replace('code', '') : id}`);
  if (container) {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Helper loader
  function loadSQLFile(filePath, targetId) {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Could not load: ${filePath}`);
        }
        return response.text();
      })
      .then(text => {
        const target = document.getElementById(targetId);
        if (target) {
          target.textContent = text;
        }
      })
      .catch(err => {
        console.error(err);
        const target = document.getElementById(targetId);
        if (target) {
          target.textContent = 'Error loading SQL file.';
        }
      });
  }

  // Load both SQL files
loadSQLFile('documents/SQL_code.sql', 'SQL-code1');
loadSQLFile('documents/car_data_table_creation.sql', 'SQL-code2');});

