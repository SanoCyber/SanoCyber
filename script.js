// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {
  
  // --- General Site Functionality ---
  console.log("DOM fully loaded. Starting SanoCyber scripts (Full Checkout - Live Mode).");

  // ... (footer year, mobile nav, AOS init as before) ...
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  
  const navToggle = document.getElementById("navToggle");
  const navLinksContainer = document.getElementById("navLinks");
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => navLinksContainer.classList.toggle("active"));
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('active')) navLinksContainer.classList.remove('active');
      });
    });
  }
  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50 });


  // --- Stripe Checkout Integration ---
  console.log("Setting up Stripe Checkout Integration (Live Mode)...");
  // IMPORTANT: Use your LIVE Publishable Key from Stripe Dashboard
  const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RPgrWJ2AdfUeYzb2xTAkDOrGh4AahXEdSXHDX90f64OJZVgUXFgNhBnSEn6X4TfL20L40IGKxDbePI1NEXgPXOk00AeSeQS3z';
  
  if (typeof Stripe === 'function') {
    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    console.log("Stripe object initialized for checkout (Live Mode).");

    // Ensure this URL is correct for your deployed worker
    const createCheckoutSessionWorkerUrl = 'https://sanocyber-checkout-worker.glen-grevatt8855.workers.dev'; 

    async function redirectToCheckout() {
      console.log('redirectToCheckout FUNCTION CALLED.');
      try {
        console.log('Attempting to create checkout session with worker:', createCheckoutSessionWorkerUrl);

        const response = await fetch(createCheckoutSessionWorkerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        console.log("Response status from worker:", response.status);
        const responseText = await response.text(); 
        console.log("Raw response text from worker:", responseText);

        if (!response.ok) {
          let errorData = { message: `Request to worker failed with status ${response.status}. Response: ${responseText}` };
          try { errorData = JSON.parse(responseText); } catch (e) { /* ignore if not json */ }
          throw new Error(errorData.error?.message || errorData.message || `HTTP error! Status: ${response.status}`);
        }
        
        const session = JSON.parse(responseText);
        console.log("Received session data from worker:", session);

        if (session.sessionId) {
          console.log('Checkout session ID received:', session.sessionId, 'Redirecting to Stripe...');
          const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
          if (error) {
            console.error('Stripe redirectToCheckout error:', error.message);
            alert(`Could not redirect to Stripe: ${error.message}`);
          } else {
            console.log("stripe.redirectToCheckout was called, browser should be redirecting.");
          }
        } else if (session.error) {
          console.error('Backend error creating session (from worker response):', session.error.message || session.error);
          alert(`Error from server: ${session.error.message || session.error}`);
        } else {
          console.error('Unknown error creating session. Worker response:', session);
          alert('Could not initiate payment due to an unknown server error. Please try again.');
        }
      } catch (error) {
        console.error('Fetch error or other client-side error in redirectToCheckout:', error);
        alert(`An error occurred: ${error.message}. Please check your connection and try again.`);
      }
    }

    const goProButtonHomepage = document.getElementById('goProButtonHomepage');
    if (goProButtonHomepage) {
      goProButtonHomepage.addEventListener('click', redirectToCheckout); 
      console.log("Event listener ADDED to goProButtonHomepage.");
    } else {
      console.warn("goProButtonHomepage was NOT FOUND on this page.");
    }

    const goProButtonPhishShieldPage = document.getElementById('goProButtonPhishShieldPage');
    if (goProButtonPhishShieldPage) {
      goProButtonPhishShieldPage.addEventListener('click', redirectToCheckout);
      console.log("Event listener ADDED to goProButtonPhishShieldPage.");
    } else {
      console.warn("goProButtonPhishShieldPage was NOT FOUND on this page.");
    }
  } else {
    console.error("Stripe.js V3 library not loaded. Stripe functionality will be unavailable.");
    alert("Payment system library failed to load. Please check your internet connection or ad-blockers.");
  }
  console.log("Stripe integration setup attempt complete.");

  // --- Page-Specific Functionality ---
  // ... (rest of your script as before) ...
  function onPage(elementId) { return document.getElementById(elementId) !== null; }
  if (onPage('password-output')) { /* ... toolkit logic ... */ }
  if (onPage('emailText')) { /* ... phishshield logic ... */ }

  console.log("SanoCyber general scripts finished executing (Full Checkout - Live Mode).");
});
