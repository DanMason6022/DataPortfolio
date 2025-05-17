// === PARTICLE BACKGROUND SETUP ===
const canvas = document.getElementById('particle-background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = Math.floor(canvas.width / 20);
const mouse = { x: null, y: null, radius: 100 };

class Particle {
  constructor() {
    this.size = Math.random() * 5 + 2;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= dx * force * 0.1;
        this.y -= dy * force * 0.1;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - distance / 240})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

canvas.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

initParticles();
animateParticles();

// === NOTEBOOK FUNCTIONALITY ===
let currentPage = 1;

const pages = document.querySelectorAll('#projects .notebook-page');
const pageIndicator = document.querySelector('.page-indicator');
const totalPages = pages.length;

function updatePageIndicator() {
  pageIndicator.textContent = `${currentPage}/${totalPages}`;
}

function showPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages) return;

  pages.forEach(page => page.classList.remove('active'));

  const targetPage = pages[pageNumber - 1];
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = pageNumber;
    updatePageIndicator();
  }
}

function turnPage(direction) {
  const notebook = document.querySelector("#projects .notebook-container");
  const pages = notebook.querySelectorAll(".notebook-page");
  const indicator = document.querySelector(".page-indicator");

  const currentIndex = Array.from(pages).findIndex(p => p.classList.contains("active"));
  if (currentIndex === -1) return;

  let nextIndex = currentIndex + direction;
  if (nextIndex < 0) nextIndex = pages.length - 1;
  if (nextIndex >= pages.length) nextIndex = 0;

  pages.forEach(p => p.classList.remove("active"));
  pages[nextIndex].classList.add("active");

  indicator.textContent = `${nextIndex + 1}/${pages.length}`;
}



function goToSection(section) {
  const firstMatch = Array.from(pages).find(p => p.dataset.section === section);
  if (!firstMatch) return;

  const pageNumber = parseInt(firstMatch.dataset.page);
  showPage(pageNumber);
}

function createSectionNavigation() {
  const sections = [...new Set(Array.from(pages).map(p => p.dataset.section))];
  const navContainer = document.createElement('div');
  navContainer.className = 'section-nav';


  document.querySelector('.page-controls').appendChild(navContainer);
}

document.addEventListener('DOMContentLoaded', () => {
  showPage(currentPage);
  createSectionNavigation();
});



// === FUTURE NOTEBOOK FUNCTIONALITY ===
let futureCurrentPage = 1;
const futurePages = document.querySelectorAll('.future-page');
const futureTotalPages = futurePages.length;
const futureIndicator = document.querySelector('.future-indicator');

function updateFutureIndicator() {
  futureIndicator.textContent = `${futureCurrentPage}/${futureTotalPages}`;
}

function turnFuturePage(direction) {
  const notebook = document.querySelector("#future-projects .notebook-container");
  const pages = notebook.querySelectorAll(".future-page");
  const indicator = document.querySelector(".future-indicator");

  const currentIndex = Array.from(pages).findIndex(p => p.classList.contains("active"));
  if (currentIndex === -1) return;

  let nextIndex = currentIndex + direction;
  if (nextIndex < 0) nextIndex = pages.length - 1;
  if (nextIndex >= pages.length) nextIndex = 0;

  pages.forEach(p => p.classList.remove("active"));
  pages[nextIndex].classList.add("active");

  indicator.textContent = `${nextIndex + 1}/${pages.length}`;

  // Optional: Animate slide direction
  const futurePageContainer = document.querySelector('.future-pages');
  if (futurePageContainer) {
    futurePageContainer.style.animation = 'none';
    void futurePageContainer.offsetWidth;
    futurePageContainer.style.animation = direction > 0
      ? 'slideLeft 0.5s ease'
      : 'slideRight 0.5s ease';
  }
}


// === DOM INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling
  document.querySelectorAll('nav a').forEach(anchor => {
    if (!anchor.getAttribute('href').includes('index.html')) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // Init primary notebook
  const activePage = document.querySelector('.notebook-page.active');
  if (activePage) {
    currentPage = parseInt(activePage.dataset.page);
    currentSection = activePage.dataset.section;
  }
  showPage(currentPage);
  createSectionNavigation();

  // Init future notebook
  futurePages.forEach(p => p.classList.remove('active'));
  const firstFuture = document.querySelector('.future-page[data-page="1"]');
  if (firstFuture) {
    firstFuture.classList.add('active');
    futureCurrentPage = 1;
  }
  updateFutureIndicator();
});
document.addEventListener('DOMContentLoaded', function () {
  // Ensure the first future page is visible
  const firstFuturePage = document.querySelector('.future-page[data-page="1"]');
  if (firstFuturePage) {
    firstFuturePage.classList.add('active');
  }
});


document.addEventListener('DOMContentLoaded', () => {
  showPage(currentPage);
  createSectionNavigation();
  addRandomDoodlesToPages(); // ⬅️ New function here
});

function addRandomDoodlesToPages() {
  const doodleImages = ['images/paper plane.png','images/planet-doodle.png','images/music-doodle.png','images/racecar-doodle.png','images/eye-doodle.png','images/rugby-ball-doodle.png','images/orange-doodle.png'
    
  ];

  const pages = document.querySelectorAll('.notebook-page');

  pages.forEach(page => {
    // Pick two random doodles
    const doodle1 = doodleImages[Math.floor(Math.random() * doodleImages.length)];
    const doodle2 = doodleImages[Math.floor(Math.random() * doodleImages.length)];

    // Create top-left doodle
    const img1 = document.createElement('img');
    img1.src = doodle1;
    img1.classList.add('doodle-corner', 'top-left');

    // Create bottom-right doodle
    const img2 = document.createElement('img');
    img2.src = doodle2;
    img2.classList.add('doodle-corner', 'bottom-right');

    // Append to the page
    page.appendChild(img1);
    page.appendChild(img2);
  });
}

function goToSection(section) {
  const notebook = document.querySelector("#projects .notebook-container");
  const pages = notebook.querySelectorAll(".notebook-page");
  const indicator = document.querySelector(".page-indicator");

  // Deactivate all
  pages.forEach(page => page.classList.remove("active"));

  // Find first matching page in the section
  const firstMatch = Array.from(pages).find(
    page => page.dataset.section === section
  );

  if (firstMatch) {
    firstMatch.classList.add("active");

    const totalPages = pages.length;
    const currentPage = Array.from(pages).indexOf(firstMatch) + 1;

    indicator.textContent = `${currentPage}/${totalPages}`;

    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const offset = 70;
        const top = notebook.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    }
  }
}

function goToFutureSection(section) {
  const notebook = document.querySelector("#future-projects .notebook-container");
  const pages = notebook.querySelectorAll(".future-page");
  const indicator = document.querySelector(".future-indicator");

  // Deactivate all future pages
  pages.forEach(page => page.classList.remove("active"));

  // Find the first page in the matching section
  const firstMatch = Array.from(pages).find(
    page => page.dataset.section === section
  );

  if (firstMatch) {
    firstMatch.classList.add("active");

    const totalPages = pages.length;
    const currentPage = Array.from(pages).indexOf(firstMatch) + 1;
    indicator.textContent = `${currentPage}/${totalPages}`;

    // Smooth scroll to notebook on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const offset = 70;
        const top = notebook.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    }
  }
}



document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-toggle').checked = false;
  });
});


function goBackOnSite() {
  const referrer = document.referrer;
  const currentHost = window.location.host;

  try {
    if (referrer && new URL(referrer).host === currentHost) {
      window.history.back();
    } else {
      window.location.href = '/index.html'; // adjust if hosted in subfolder
    }
  } catch (e) {
    window.location.href = '/index.html';
  }
}


