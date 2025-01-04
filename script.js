// Display the current year in footers
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const yearSpan2 = document.getElementById("year2");
if (yearSpan2) {
  yearSpan2.textContent = new Date().getFullYear();
}

// Smooth scrolling & nav link handling
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // If the link is an anchor referencing a section
    // in index.html or about.html
    if (link.getAttribute("href").includes("#")) {
      // Only prevent default if it's a same-page anchor
      const [pageRef, anchor] = link.getAttribute("href").split("#");
      // If there's no pageRef, it's same-page
      if (!pageRef) {
        e.preventDefault();
        const targetId = anchor;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    // Close the mobile nav
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
