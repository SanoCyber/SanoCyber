// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {
  
  // --- General Site Functionality ---
  console.log("DOM fully loaded. Starting SanoCyber scripts (Live Mode - Corrected).");

  // 1. Update the year in the footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
    // console.log("Footer year updated."); // Less verbose logging for production
  } else {
    console.warn("Footer year span not found.");
  }

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navLinksContainer = document.getElementById("navLinks");

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active");
      // console.log("Nav toggled.");
    });

    const allNavLinks = navLinksContainer.querySelectorAll('a');
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close mobile nav if a link inside it is clicked
        if (navLinksContainer.classList.contains('active') && window.innerWidth < 768) { // 768px is Tailwind's 'md' breakpoint
          navLinksContainer.classList.remove('active');
        }
      });
    });
    // console.log("Mobile nav listeners attached.");
  } else {
    console.warn("Mobile nav elements not found for toggle.");
  }

  // 3. Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') { 
    try {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
      });
      // console.log("AOS initialized successfully.");
    } catch (e) {
      console.error("AOS initialization failed:", e);
    }
  } else {
    console.warn("AOS library not found. Ensure aos.js is linked in HTML <head> before this script.");
  }

  
  // --- Stripe Checkout Integration ---
  const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RPgrWJ2AdfUeYzb2xTAkDOrGh4AahXEdSXHDX90f64OJZVgUXFgNhBnSEn6X4TfL20L40IGKxDbePI1NEXgPXOk00AeSeQS3z';
  const createCheckoutSessionWorkerUrl = 'https://sanocyber-checkout-worker.glen-grevatt8855.workers.dev';

  function checkStripeReady(callback) {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      if (typeof Stripe === 'function') {
        clearInterval(interval);
        callback(Stripe(STRIPE_PUBLISHABLE_KEY));
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error("Stripe.js failed to load after multiple attempts.");
          if (document.getElementById('goProButtonHomepage') || document.getElementById('goProButtonPhishShieldPage')) {
            alert("⚠️ Payment system failed to load. Please refresh or try another browser.");
          }
        }
      }
    }, 300);
  }

  checkStripeReady((stripe) => {
    async function redirectToCheckout() {
      try {
        const response = await fetch(createCheckoutSessionWorkerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const responseText = await response.text();
        if (!response.ok) throw new Error(`Worker error: ${response.status} - ${responseText}`);

        const session = JSON.parse(responseText);
        if (session.sessionId) {
          const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
          if (error) {
            console.error("Stripe redirect error:", error.message);
            alert(`Could not redirect to Stripe: ${error.message}`);
          }
        } else {
          throw new Error(session.error?.message || "Unknown error from server.");
        }
      } catch (error) {
        console.error("RedirectToCheckout Error:", error);
        alert(`Payment error: ${error.message}`);
      }
    }

    const goProButtonHomepage = document.getElementById('goProButtonHomepage');
    if (goProButtonHomepage) {
      goProButtonHomepage.addEventListener('click', redirectToCheckout);
    }

    const goProButtonPhishShieldPage = document.getElementById('goProButtonPhishShieldPage');
    if (goProButtonPhishShieldPage) {
      goProButtonPhishShieldPage.addEventListener('click', redirectToCheckout);
    }
  });

  // --- Page-Specific Functionality ---
  function onPage(elementId) { return document.getElementById(elementId) !== null; }

  // --- Toolkit Page Functionality (tools.html) ---
  if (onPage('password-output')) { 
    // console.log("On Tools page, setting up toolkit functions.");
    const lengthElement = document.getElementById('length');
    const lengthValueSpan = document.getElementById('lengthValue'); // For displaying the length
    const includeUppercaseElement = document.getElementById('include-uppercase');
    const includeNumbersElement = document.getElementById('include-numbers');
    const includeSymbolsElement = document.getElementById('include-symbols');
    const passwordOutputElement = document.getElementById('password-output');
    const generatePasswordButton = document.getElementById('generatePasswordButton'); 
    const copyPasswordButton = document.getElementById('copyPasswordButton');       
    const passwordInputElement = document.getElementById("passwordInput"); // For breach checker
    const checkPasswordBreachButton = document.getElementById('checkPasswordBreachButton'); 
    const resultElementBreach = document.getElementById("result"); // For breach checker

    if (lengthElement && lengthValueSpan) {
        lengthValueSpan.textContent = lengthElement.value; // Initial display
        lengthElement.addEventListener('input', function() {
            lengthValueSpan.textContent = this.value;
        });
    }

    if (generatePasswordButton) generatePasswordButton.addEventListener('click', generatePassword);
    if (copyPasswordButton) copyPasswordButton.addEventListener('click', copyPassword);
    if (checkPasswordBreachButton) checkPasswordBreachButton.addEventListener('click', checkPasswordBreach);

    function generatePassword() { 
        if (!lengthElement || !includeUppercaseElement || !includeNumbersElement || !includeSymbolsElement || !passwordOutputElement) { console.error("Password generator DOM elements missing."); if(passwordOutputElement) passwordOutputElement.textContent = "Error: Page elements missing."; return; }
        const length = parseInt(lengthElement.value, 10);
        if (isNaN(length) || length < 6 || length > 64) { alert("Please enter a valid password length between 6 and 64."); return; }
        const includeUppercase = includeUppercaseElement.checked;
        const includeNumbers = includeNumbersElement.checked;
        const includeSymbols = includeSymbolsElement.checked;
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        let charSet = lowercaseChars;
        if (includeUppercase) charSet += uppercaseChars;
        if (includeNumbers) charSet += numberChars;
        if (includeSymbols) charSet += symbolChars;
        if (charSet.length === 0) { // Ensure at least one character set is selected if lowercase is optional
            passwordOutputElement.textContent = "Select character types";
            passwordOutputElement.classList.add('text-red-500');
            return;
        }
        passwordOutputElement.classList.remove('text-red-500');

        let password = '';
        for (let i = 0; i < length; i++) { const randomIndex = Math.floor(Math.random() * charSet.length); password += charSet[randomIndex]; }
        passwordOutputElement.textContent = password;
        passwordOutputElement.classList.remove('text-gray-500', 'justify-center'); 
        passwordOutputElement.classList.add('text-gray-800');
    }
    function copyPassword() { 
        if (!passwordOutputElement) { alert('Error: Password output element not found.'); return; }
        const passwordToCopy = passwordOutputElement.textContent;
        const initialMessages = ["Click \"Generate\"", "Select character types"]; // Simpler check
        if (initialMessages.some(msg => passwordToCopy.includes(msg)) || !passwordToCopy || passwordToCopy === "Error: Page elements missing.") { 
            alert("Please generate a valid password first."); return; 
        }
        navigator.clipboard.writeText(passwordToCopy)
        .then(() => { alert('Password copied to clipboard!'); })
        .catch((err) => { console.error('Failed to copy password: ', err); alert('Failed to copy password. Please try again or copy manually.'); });
    }
    async function checkPasswordBreach() { 
        if (!passwordInputElement || !resultElementBreach) { console.error("Password breach checker DOM elements missing."); if(resultElementBreach) resultElementBreach.innerHTML = "<p class='text-red-600'>Error: Page elements missing.</p>"; return; }
        const password = passwordInputElement.value.trim();
        if (!password) { resultElementBreach.innerHTML = "<p class='text-yellow-600'>Please enter a password to check.</p>"; return; }
        resultElementBreach.innerHTML = "<p class='text-blue-600 animate-pulse'>Checking...</p>";
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest("SHA-1", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            const prefix = hashHex.substring(0, 5);
            const suffix = hashHex.substring(5);
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!response.ok) throw new Error(`API request failed: ${response.status}`);
            const text = await response.text();
            const lines = text.split('\n');
            const match = lines.find(line => line.startsWith(suffix));
            if (match) {
                const count = match.split(':')[1].trim();
                resultElementBreach.innerHTML = `<p class='text-red-600'>❌ Oh no! This password has appeared <strong class='font-bold'>${count}</strong> times in data breaches. Consider a stronger password.</p>`;
            } else {
                resultElementBreach.innerHTML = "<p class='text-green-600'>✅ Good news! This password was not found in this breach database.</p>";
            }
        } catch (err) {
            console.error("Error checking password:", err);
            resultElementBreach.innerHTML = `<p class='text-red-600'>Error checking password: ${err.message}. Please try again later.</p>`;
        }
    }
  } 

  // --- PhishShield Page Functionality (phishshield.html) ---
  if (onPage('emailText')) { 
    // console.log("On PhishShield page, setting up PhishShield functions.");
    const analyzeEmailButton = document.getElementById('analyzeEmailButton'); 
    if (analyzeEmailButton) analyzeEmailButton.addEventListener('click', analyzeEmail);
    
    const SCAN_LIMIT = 3; 
    const SCAN_KEY = 'phishshield-scan-count';
    const RESET_KEY = 'phishshield-scan-date';

    function resetDailyCount() {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(RESET_KEY, today);
      localStorage.setItem(SCAN_KEY, '0');
      // console.log("Daily scan count reset.");
    }

    function checkAndUpdateCount() {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = localStorage.getItem(RESET_KEY);
      if (lastDate !== today) {
        resetDailyCount();
      }
      let count = parseInt(localStorage.getItem(SCAN_KEY) || '0', 10);
      
      // For Pro users (once implemented), this check would be different
      // For now, always enforce for non-pro:
      if (count >= SCAN_LIMIT) {
        // console.log("Scan limit reached for today.");
        return false; 
      }
      count++;
      localStorage.setItem(SCAN_KEY, String(count));
      // console.log(`Scan count: ${count}/${SCAN_LIMIT}`);
      return true; 
    }

    async function analyzeEmail() {
      const emailTextElement = document.getElementById('emailText');
      const resultDivPhishShield = document.getElementById('phishshieldResult'); 
      const limitWarningDiv = document.getElementById('limitWarning');

      if (!emailTextElement || !resultDivPhishShield || !limitWarningDiv) {
        console.error("PhishShield DOM elements missing.");
        if(resultDivPhishShield) resultDivPhishShield.innerHTML = "<p class='text-red-600 font-semibold'>Client-side error: Page elements missing.</p>";
        return;
      }
      const emailText = emailTextElement.value.trim();
      if (!emailText) {
        resultDivPhishShield.innerHTML = "<p class='text-yellow-600 font-semibold'>Please paste email content to analyze.</p>";
        return;
      }
      
      if (!checkAndUpdateCount()) { 
        limitWarningDiv.style.display = 'block';
        resultDivPhishShield.innerHTML = ''; // Clear previous results
        return;
      }
      limitWarningDiv.style.display = 'none';
      resultDivPhishShield.innerHTML = "<p class='text-blue-600 animate-pulse'>Analyzing, please wait...</p>";
      try {
        const response = await fetch('https://bitter-mud-23b3.glen-grevatt8855.workers.dev', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailText })
        });
        if (!response.ok) {
          let errorData = { message: response.statusText };
          try { 
            const errorText = await response.text();
            console.error("PhishShield API raw error:", errorText);
            errorData = JSON.parse(errorText); 
          } catch (e) { /* no json body or failed to parse */ }
          throw new Error(`PhishShield API error ${response.status}: ${errorData.message || 'Failed to fetch analysis'}`);
        }
        const data = await response.json();
        // Sanitize or carefully render HTML if 'data.result' can contain HTML
        // For now, assuming plain text or simple formatting handled by pre-wrap
        resultDivPhishShield.textContent = data.result || 'No valid response received from the analysis.';
        // If you expect HTML, use resultDivPhishShield.innerHTML = data.result; but be cautious.
      } catch (err) {
        console.error("Error analyzing email:", err);
        resultDivPhishShield.innerHTML = `<p class='text-red-600 font-semibold'><strong>Error:</strong> ${err.message || 'Could not connect to PhishShield service.'}</p>`;
      }
    }
  } 

  // console.log("SanoCyber general scripts finished executing (Live Mode - Corrected).");
});
