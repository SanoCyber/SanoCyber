// Wait for the DOM to be fully loaded before running scripts

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded. Starting SanoCyber scripts (Full Checkout Debug).");

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
    console.log("Footer year updated.");
  } else {
    console.warn("Footer year span not found.");
  }

  const navToggle = document.getElementById("navToggle");
  const navLinksContainer = document.getElementById("navLinks");
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active");
      console.log("Nav toggled.");
    });

    const allNavLinks = navLinksContainer.querySelectorAll('a');
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('active')) {
          navLinksContainer.classList.remove('active');
        }
      });
    });
    console.log("Mobile nav listeners attached.");
  } else {
    console.warn("Mobile nav elements not found.");
  }

  if (typeof AOS !== 'undefined') {
    try {
      AOS.init({ duration: 800, once: true, offset: 50 });
      console.log("AOS initialized successfully.");
    } catch (e) {
      console.error("AOS initialization failed:", e);
    }
  } else {
    console.warn("AOS library not found. Ensure aos.js is linked in HTML <head> before this script.");
  }

  console.log("Setting up Stripe Checkout Integration...");
  const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RPgrWJ2AdfUeYzb2xTAkDOrGh4AahXEdSXHDX90f64OJZVgUXFgNhBnSEn6X4TfL20L40IGKxDbePI1NEXgPXOk00AeSeQS3z';

  if (typeof Stripe === 'function') {
    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    console.log("Stripe object initialized for checkout.");

    const createCheckoutSessionWorkerUrl = 'https://sanocyber-checkout-worker.glen-grevatt8855.workers.dev';

    async function redirectToCheckout() {
      console.log('redirectToCheckout FUNCTION CALLED.');
      try {
        console.log('Attempting to create checkout session with worker:', createCheckoutSessionWorkerUrl);

        const response = await fetch(createCheckoutSessionWorkerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: 'test@sanocyber.com' })
        });

        console.log("Response status from worker:", response.status);
        if (!response.ok) {
          let errorData = { message: `Request to worker failed with status ${response.status}` };
          let errorText = "(Could not get raw error text from worker)";
          try {
            errorText = await response.text();
            console.error("Raw error response from worker:", errorText);
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error("Could not parse error response from worker as JSON. Raw text was:", errorText);
          }
          throw new Error(errorData.error?.message || errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const session = await response.json();
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
          console.error('Unknown error creating session. Worker response:", session);
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

  function onPage(elementId) {
    return document.getElementById(elementId) !== null;
  }

  if (onPage('password-output')) {
    console.log("On Tools page, setting up toolkit functions.");
    // ... (password generator logic here)
  }

  if (onPage('emailText')) {
    console.log("On PhishShield page, setting up PhishShield functions.");
    // ... (phishing analysis logic here)
  }

  console.log("SanoCyber general scripts finished executing (Full Checkout Debug).");
});
