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
// Initialize AOS
AOS.init({
  duration: 1000, // animation duration in milliseconds
  once: true, // whether animation should happen only once
});
// Password Generator Functions
function generatePassword() {
  const length = document.getElementById('length').value;
  const includeUppercase = document.getElementById('include-uppercase').checked;
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeSymbols = document.getElementById('include-symbols').checked;

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  let charSet = lowercaseChars;
  if (includeUppercase) charSet += uppercaseChars;
  if (includeNumbers) charSet += numberChars;
  if (includeSymbols) charSet += symbolChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  }

  document.getElementById('password-output').textContent = password;
}

function copyPassword() {
  const passwordOutput = document.getElementById('password-output');
  const text = passwordOutput.textContent;

  navigator.clipboard.writeText(text).then(() => {
    alert('Password copied to clipboard!');
  }).catch(err => {
    alert('Failed to copy password.');
  });
}


