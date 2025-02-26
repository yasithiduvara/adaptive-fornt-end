import gsap from "gsap";

export const animateIn = (element: HTMLElement) => {
  // Reset position and opacity before animating in
  gsap.set(element, {
    opacity: 0,
    y: 20,
  });
  
  // Animate in
  return gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
  });
};

export const animateOut = (element: HTMLElement, onComplete?: () => void) => {
  return gsap.to(element, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: "power2.in",
    onComplete,
  });
}; 