document.addEventListener('DOMContentLoaded', function () {
  // Update the year in the footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Smooth scrolling & active link handling
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Check if the href contains a hash for same-page navigation
      if (link.getAttribute("href").includes("#")) {
        const [pageRef, anchor] = link.getAttribute("href").split("#");
        if (!pageRef) {
          e.preventDefault();
          const targetElement = document.getElementById(anchor);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
      // Close the mobile nav when a link is clicked
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
});
