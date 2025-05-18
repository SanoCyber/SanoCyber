// supabaseClient.js

// This script assumes the Supabase CDN <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// has ALREADY BEEN LOADED in your HTML file (signup.html) before this script (supabaseClient.js) is loaded.
// This means the global 'supabase' object (which contains the createClient function) should be available.

// A quick check to see if the main Supabase library is loaded
if (typeof supabase === 'undefined' || typeof supabase.createClient === 'undefined') {
    console.error('CRITICAL ERROR: Supabase CDN library (supabase-js@2) was not loaded BEFORE supabaseClient.js. Check script order in your HTML.');
    // You could display an error to the user or stop further execution
    // For now, we'll log to console, but this would break the signup.
} else {
    const supabaseUrl = 'https://mrsrtpkjasziekznictz.supabase.co'; // Your Supabase URL
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc3J0cGtqYXN6aWVrem5pY3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTU2MTcsImV4cCI6MjA2MzA3MTYxN30.fwd6rSvtc-MelQFDSF54_dA3ZS_0aLaCQkYvv2wE-OQ'; // <-- IMPORTANT: REPLACE THIS WITH YOUR REAL ANON KEY

    // Create the Supabase client instance
    // And make it globally accessible by attaching it to the 'window' object
    // This allows your inline script in signup.html to find and use it.
    window.mySupabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

    console.log('supabaseClient.js has run and mySupabaseClient should be initialized.');
}