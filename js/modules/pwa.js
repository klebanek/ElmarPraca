export function initPWA() {
    let deferredPrompt;
    const banner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
    }

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if (banner) {
            // Delay showing the banner slightly
            setTimeout(() => {
                banner.classList.add('show');
            }, 3000);
        }
    });

    // Special handling for iOS (show instructions if not installed)
    // For now we just show the banner if not standalone, but iOS doesn't support beforeinstallprompt
    // So we might need to change the text for iOS users or just hide it.
    // Let's rely on standard banner for now, but usually iOS users need manual "Share -> Add to Home Screen".
    // We can add a detection here.
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
        // On iOS we can't trigger the prompt programmatically.
        // We could show a specific iOS instruction.
        // For this task, we'll just ensure the banner doesn't show if we can't install,
        // OR we change the button to "Instrukcja".
        // However, the user specifically asked about "adding to main screen on iPhone causing error".
        // So fixing the 404 is the main thing. The install banner is a bonus for other devices/general usage.
    }

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            // Hide the app provided install promotion
            if (banner) banner.classList.remove('show');

            // Show the install prompt
            if (deferredPrompt) {
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            } else {
                // Fallback for when deferredPrompt is not available (e.g. manual triggering or unsupported browser)
                alert('Aby zainstalować aplikację: \n1. Kliknij ikonę udostępniania/menu przeglądarki\n2. Wybierz "Dodaj do ekranu głównego"');
            }
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (banner) banner.classList.remove('show');
        });
    }
}
