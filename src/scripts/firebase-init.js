// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSPpgTbO8BNQnBfePMJO3LtA_mQgGggQQ",
    authDomain: "testing-website-25fbc.firebaseapp.com",
    projectId: "testing-website-25fbc",
    storageBucket: "testing-website-25fbc.firebasestorage.app",
    messagingSenderId: "969016511943",
    appId: "1:969016511943:web:aeb9a5f01360e830091de2",
    measurementId: "G-H4C784SMGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Function to get user location with consent
async function getUserLocation() {
    // Check if we already have consent stored
    const hasLocationConsent = localStorage.getItem('locationConsent');
    
    if (!hasLocationConsent) {
        // Create and show the consent modal
        const modal = document.createElement('div');
        modal.setAttribute('data-modal', 'consent');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; text-align: center;">
                    <i class="fas fa-map-marker-alt" style="color: #4A90E2; font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3 style="margin-bottom: 1rem;">Location Access Required</h3>
                    <p style="margin-bottom: 1.5rem;">Talking Clock Pro is currently available in selected locations only. We need your location to verify service availability in your region.</p>
                    <button onclick="window.approveLocation();" style="background: #4A90E2; color: white; border: none; padding: 8px 16px; margin: 8px; border-radius: 4px; cursor: pointer;">Allow Access</button>
                    <button onclick="window.denyLocation();" style="background: #gray; border: none; padding: 8px 16px; margin: 8px; border-radius: 4px; cursor: pointer;">Not Now</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        return;
    }

    if (hasLocationConsent === 'denied') {
        return;
    }

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Log location to Firebase Analytics
        logEvent(analytics, 'user_location', {
            latitude: position.coords.latitude.toFixed(2),
            longitude: position.coords.longitude.toFixed(2),
            accuracy: Math.round(position.coords.accuracy)
        });

        return position;
    } catch (error) {
        console.log('Error getting location:', error);
        
        // Handle browser-level permission denial
        if (error.code === 1) { // PERMISSION_DENIED
            localStorage.setItem('locationConsent', 'denied');
            // Show restriction message
            const restrictionModal = document.createElement('div');
            restrictionModal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; text-align: center;">
                        <i class="fas fa-exclamation-circle" style="color: #e74c3c; font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h3 style="color: #e74c3c; margin-bottom: 1rem;">Location Access Denied</h3>
                        <p style="margin-bottom: 1.5rem;">You've blocked location access in your browser. Talking Clock Pro is only available in selected locations, so we might not be able to serve you properly.</p>
                        <p style="margin-bottom: 1.5rem; font-size: 0.9rem;">To enable location access: Click the location icon in your browser's address bar and allow access, then refresh the page.</p>
                        <button onclick="this.closest('[style*=\'position: fixed\']').remove();" style="background: #4A90E2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Understood</button>
                    </div>
                </div>`;
            document.body.appendChild(restrictionModal);
            logEvent(analytics, 'browser_location_denied');
        }
        return null;
    }
}

// Add functions to window object for HTML access
window.approveLocation = function() {
    localStorage.setItem('locationConsent', 'approved');
    document.querySelector('[data-modal="consent"]')?.remove();
    getUserLocation();
};

window.denyLocation = function() {
    localStorage.setItem('locationConsent', 'denied');
    
    // Remove the consent modal
    document.querySelector('[data-modal="consent"]')?.remove();
    
    // Show restriction message modal
    const restrictionModal = document.createElement('div');
    restrictionModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; text-align: center;">
                <i class="fas fa-exclamation-circle" style="color: #e74c3c; font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3 style="color: #e74c3c; margin-bottom: 1rem;">Location Access Required</h3>
                <p style="margin-bottom: 1.5rem;">We apologize, but Talking Clock Pro is currently available only in selected locations. Without location access, we might not be able to serve you properly.</p>
                <div style="display: flex; justify-content: center; gap: 1rem;">
                    <button onclick="window.retryLocation();" style="background: #4A90E2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Try Again</button>
                    <button onclick="this.closest('[style*=\'position: fixed\']').remove();" style="background: #gray; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(restrictionModal);
    
    logEvent(analytics, 'location_access_denied');
};

window.retryLocation = function() {
    localStorage.removeItem('locationConsent');
    document.querySelector('[style*="position: fixed"]')?.remove();
    getUserLocation();
};

// Initialize tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Request location after a short delay
    setTimeout(getUserLocation, 2000);

    // Track download button clicks
    document.querySelectorAll('[href*="apps.apple.com"]').forEach(button => {
        button.addEventListener('click', () => {
            logEvent(analytics, 'app_download_clicked', {
                source: 'hero_section'
            });
        });
    });

    // Track language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            logEvent(analytics, 'language_changed', {
                from: document.documentElement.lang || 'en',
                to: document.documentElement.lang === 'en' ? 'ja' : 'en'
            });
        });
    }

    // Track feature card views
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logEvent(analytics, 'feature_card_viewed', {
                    feature_name: entry.target.querySelector('h3')?.textContent
                });
                observer.unobserve(entry.target); // Only track first view
            }
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
});