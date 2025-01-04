// Display the current year in any footer elements
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const yearSpan2 = document.getElementById("year2");
if (yearSpan2) {
  yearSpan2.textContent = new Date().getFullYear();
}

// Smooth scrolling for nav links
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // If link is #anchor or same-page reference:
    if (link.getAttribute("href").includes("#")) {
      e.preventDefault();
      const targetId = link.getAttribute("href").split("#")[1];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
    // Close the mobile nav after clicking a link
    document.getElementById("navLinks").classList.remove("show");
    // Update active link class
    navLinks.forEach((navItem) => navItem.classList.remove("active-link"));
    link.classList.add("active-link");
  });
});

// Toggle navigation for mobile
const navToggle = document.getElementById("navToggle");
const navLinksContainer = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinksContainer.classList.toggle("show");
});
