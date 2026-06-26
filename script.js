document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("cravebox-theme") || "dark";
  root.setAttribute("data-theme", savedTheme);

  const toggleButton = document.querySelector(".theme-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", current);
      localStorage.setItem("cravebox-theme", current);
    });
  }

  const loader = document.querySelector(".loading-screen");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 900);
  }

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const target = new URL(link.href, window.location.href).pathname;
    if (target === window.location.pathname) {
      link.classList.add("active");
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  const particlesContainer = document.querySelector(".particles");
  if (particlesContainer) {
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${8 + Math.random() * 6}s`;
      p.style.animationDelay = `${-Math.random() * 10}s`;
      particlesContainer.appendChild(p);
    }
  }

  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = document.querySelector(btn.getAttribute("data-scroll"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
