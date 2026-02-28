gsap.registerPlugin(ScrollTrigger);

gsap.from(".difference-card", {
  scrollTrigger: {
    trigger: ".difference-grid",
    start: "top 80%"
  },
  y: 60,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  ease: "power3.out"
});

gsap.from(".ingredients-right img", {
  scrollTrigger: {
    trigger: ".about-ingredients",
    start: "top 75%"
  },
  y: 80,
  opacity: 0,
  duration: 1.2
});