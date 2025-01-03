// Display the current year in the footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Smooth scrolling for nav links
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // Scroll smoothly to the section
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
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
