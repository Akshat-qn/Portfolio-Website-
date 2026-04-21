const typingElement = document.getElementById("typingText");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const scrollProgress = document.getElementById("scrollProgress");
const cursorGlow = document.querySelector(".cursor-glow");
const particleCanvas = document.getElementById("particleCanvas");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const parallaxTarget = document.querySelector("[data-parallax]");

const typingPhrases = [
  "B.Tech CSE Student",
  "AI Enthusiast",
  "Developer",
  "Innovator"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];
  const displayedText = currentPhrase.slice(0, charIndex);
  typingElement.textContent = displayedText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(typeEffect, 110);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeEffect, 55);
    return;
  }

  if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeEffect, 1400);
  } else {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    setTimeout(typeEffect, 220);
  }
}

function toggleMenu() {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
}

function closeMenu() {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

function observeReveals() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("skill-card")) {
        const progressBar = entry.target.querySelector(".progress-track span");
        const progressValue = entry.target.dataset.progress;
        progressBar.style.width = `${progressValue}%`;
      }

      if (entry.target.querySelector(".counter")) {
        const counter = entry.target.querySelector(".counter");
        if (!counter.dataset.started) {
          animateCounter(counter);
          counter.dataset.started = "true";
        }
      }

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1600;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    counter.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(updateCount);
}

function setupInteractions() {
  navToggle.addEventListener("click", toggleMenu);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedOutsideMenu = !navLinks.contains(event.target) && !navToggle.contains(event.target);
    if (clickedOutsideMenu) closeMenu();
  });

  window.addEventListener("scroll", updateScrollProgress);
  updateScrollProgress();

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorGlow.style.left = `${clientX}px`;
    cursorGlow.style.top = `${clientY}px`;

    if (!parallaxTarget || window.innerWidth < 860) return;

    const xShift = (clientX / window.innerWidth - 0.5) * 18;
    const yShift = (clientY / window.innerHeight - 0.5) * 18;
    parallaxTarget.style.setProperty("--parallax-x", `${xShift}px`);
    parallaxTarget.style.setProperty("--parallax-y", `${yShift}px`);
  });

  window.addEventListener("mouseleave", () => {
    if (parallaxTarget) {
      parallaxTarget.style.setProperty("--parallax-x", "0px");
      parallaxTarget.style.setProperty("--parallax-y", "0px");
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = contactForm.querySelector("button");
      const originalText = button.textContent;
      button.textContent = "Message Sent";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 1800);
    });
  }
}

function initParticles() {
  const context = particleCanvas.getContext("2d");
  const particles = [];
  const particleCount = 80;

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticles() {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        radius: Math.random() * 1.9 + 0.5,
        velocityX: (Math.random() - 0.5) * 0.22,
        velocityY: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  function drawParticles() {
    context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (particle.x < 0 || particle.x > particleCanvas.width) {
        particle.velocityX *= -1;
      }

      if (particle.y < 0 || particle.y > particleCanvas.height) {
        particle.velocityY *= -1;
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(94, 230, 255, ${particle.opacity})`;
      context.shadowBlur = 12;
      context.shadowColor = "rgba(94, 230, 255, 0.55)";
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const otherParticle = particles[nextIndex];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(otherParticle.x, otherParticle.y);
          context.strokeStyle = `rgba(94, 230, 255, ${0.09 - distance / 1400})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

typeEffect();
observeReveals();
setupInteractions();
initParticles();
style.css
