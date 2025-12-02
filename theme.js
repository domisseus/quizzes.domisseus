document.addEventListener('DOMContentLoaded', () => {
    const lightBtn = document.getElementById('lightBtn');
    const darkBtn = document.getElementById('darkBtn');
    const body = document.body;

    // 1. Check Local Storage on Load
    // This runs on EVERY page to apply the user's preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        
        // Only update buttons if they actually exist on this page
        if (darkBtn && lightBtn) {
            darkBtn.classList.add('active');
            lightBtn.classList.remove('active');
        }
    } else {
        // Default to light
        if (darkBtn && lightBtn) {
            lightBtn.classList.add('active');
            darkBtn.classList.remove('active');
        }
    }

    // 2. Event Listeners
    // We only add click listeners if the buttons exist (i.e., on index.html)
    if (lightBtn && darkBtn) {
        lightBtn.addEventListener('click', () => {
            disableDarkMode();
        });

        darkBtn.addEventListener('click', () => {
            enableDarkMode();
        });
    }

    // Helper Functions
    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        
        if (darkBtn && lightBtn) {
            darkBtn.classList.add('active');
            lightBtn.classList.remove('active');
        }
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        
        if (lightBtn && darkBtn) {
            lightBtn.classList.add('active');
            darkBtn.classList.remove('active');
        }
    }
});