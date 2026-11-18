/* Victoria Lounge Cafe & Bakers — interactions: mobile menu (instant toggle),
   lightbox gallery, scroll-spy nav, reveal on scroll. */
(function () {
  "use strict";

  /* ---- Mobile menu: instant open/close via hidden attribute, no transitions ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      toggle.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        toggle.focus();
      }
    });
  }

  /* ---- Lightbox gallery ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lastFocus = null;
  function openLightbox(item) {
    lastFocus = document.activeElement;
    lightboxImg.src = item.getAttribute("data-full");
    lightboxImg.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ---- Scroll-spy: highlight current nav section ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".desktop-nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(
    ".about-copy, .about-photo, .section-head, .counter-photo, .bakery-copy, " +
    ".bakery-photos figure, .iftar-photo, .iftar-note, .cafefood-photo, .cafefood-copy, " +
    ".room-photo, .why-card, .gatherings-copy, .gatherings-photos figure, " +
    ".gallery-item, .visit-card, .visit-map, .faq-list details, .final-cta-inner"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); ro.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();
