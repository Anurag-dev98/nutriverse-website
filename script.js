document.addEventListener("DOMContentLoaded", () => {

  /* ===== STORE REVEAL ===== */
  const cards = document.querySelectorAll(".store-card");
  const section = document.querySelector(".availability-impact");

  if (section) {
    const observer = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("active");
          }, index * 200);
        });
        obs.disconnect();
      }
    }, { threshold: 0.4 });

    observer.observe(section);
  }

  /* Header Scroll Effect */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* Mobile Toggle */
const toggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".nav-mobile");

toggle.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});



  /* ===== GSAP ===== */
  if (window.gsap) {

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".editorial-card", {
      scrollTrigger: {
        trigger: ".products-editorial",
        start: "top 75%"
      },
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out"
    });

    gsap.from(".why-title", {
      scrollTrigger: {
        trigger: ".why-nutriverse",
        start: "top 75%"
      },
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    });

    gsap.from(".why-right img", {
      scrollTrigger: {
        trigger: ".why-nutriverse",
        start: "top 75%"
      },
      y: 120,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });

  }

});