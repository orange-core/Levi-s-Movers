import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./quote-form.js";

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("js-ready");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

if (!reducedMotion) {
  gsap.utils.toArray("[data-reveal]").forEach((element) => {
    gsap.fromTo(element, { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 88%", once: true }
    });
  });

  const hero = document.querySelector(".hero");
  if (hero) {
    gsap.to(".hero__orb--one", { x: -35, y: 35, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".hero__orb--two", { x: 28, y: -22, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.from(".hero__content > *", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.09, ease: "power2.out", delay: 0.1 });
    gsap.from(".hero__visual", { x: 25, autoAlpha: 0, duration: 0.9, ease: "power2.out", delay: 0.2 });
  }
  const pageHero = document.querySelector(".page-hero");
  if (pageHero) {
    gsap.from(".page-hero__copy > *", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.09, ease: "power2.out" });
    gsap.from(".page-hero__image", { x: 25, autoAlpha: 0, duration: 0.85, ease: "power2.out", delay: 0.15 });
  }
}

document.querySelectorAll(".service-card, .value-card, .process-step").forEach((card) => {
  if (reducedMotion) return;
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--pointer-x", `${x * 100}%`);
    card.style.setProperty("--pointer-y", `${y * 100}%`);
  });
});

const nav = document.querySelector(".site-header");
if (nav && !reducedMotion) {
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    nav.classList.toggle("is-scrolled", currentY > 12);
    lastY = currentY;
  }, { passive: true });
}