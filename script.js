document.addEventListener('DOMContentLoaded', () => {
    // State
    let totalIntake = 0;
    const GOAL_INTAKE = 2500; // Example daily goal for visualization scaling

    // Elements
    const intakeDisplay = document.getElementById('current-intake');
    const wave = document.getElementById('wave');
    const presetButtons = document.querySelectorAll('.btn-preset');
    const customInput = document.getElementById('custom-amount');
    const sliderValueDisplay = document.getElementById('slider-value-display');
    const btnAddCustom = document.getElementById('btn-add-custom');
    const btnReset = document.getElementById('btn-reset');
    const appContainer = document.querySelector('.app-container');

    // Initialize
    const savedIntake = localStorage.getItem('totalIntake');
    if (savedIntake) {
        totalIntake = parseInt(savedIntake);
    }
    updateUI();

    // Event Listeners
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            addIntake(amount);
        });
    });

    // Slider value update
    customInput.addEventListener('input', () => {
        sliderValueDisplay.textContent = customInput.value;
    });

    btnAddCustom.addEventListener('click', () => {
        const amount = parseInt(customInput.value);
        if (amount > 0) {
            addIntake(amount);
            // Reset slider to 0 after adding? Or keep it? Let's reset for better flow.
            customInput.value = 0;
            sliderValueDisplay.textContent = '0';
        }
    });

    btnReset.addEventListener('click', resetIntake);

    // Functions
    function addIntake(amount) {
        totalIntake += amount;
        saveData();
        updateUI();
        triggerFeedback();
    }

    // Modal Elements
    const modal = document.getElementById('confirm-modal');
    const btnModalCancel = document.getElementById('btn-modal-cancel');
    const btnModalConfirm = document.getElementById('btn-modal-confirm');

    function resetIntake() {
        showModal();
    }

    function showModal() {
        modal.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
    }

    function performReset() {
        totalIntake = 0;
        saveData();
        updateUI();
        triggerFeedback();
        hideModal();
    }

    btnModalCancel.addEventListener('click', hideModal);
    btnModalConfirm.addEventListener('click', performReset);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    function saveData() {
        localStorage.setItem('totalIntake', totalIntake);
    }

    function updateUI() {
        // Update text
        intakeDisplay.textContent = totalIntake;

        // Update wave height
        // Cap at 100% but allow calculation to go higher for logic if needed,
        // but visually it should probably stop or slow down.
        // Let's cap visual at 100%
        const percentage = Math.min((totalIntake / GOAL_INTAKE) * 100, 100);
        wave.style.height = `${percentage}%`;

        // Change wave color slightly as it fills? Optional polish.
    }

    function triggerFeedback() {
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Visual shake effect on container
        appContainer.classList.add('shaking');
        setTimeout(() => {
            appContainer.classList.remove('shaking');
        }, 300);
    }

    // Shake Detection
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastUpdate = 0;
    const SHAKE_THRESHOLD = 15;

    function handleMotion(event) {
        const current = event.accelerationIncludingGravity;
        if (!current) return;

        const currentTime = new Date().getTime();
        if ((currentTime - lastUpdate) > 100) {
            const diffTime = currentTime - lastUpdate;
            lastUpdate = currentTime;

            const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;

            if (speed > SHAKE_THRESHOLD * 100) { // Adjusted threshold logic
                 // Simple debounce/check
                 resetIntake();
            }

            lastX = current.x;
            lastY = current.y;
            lastZ = current.z;
        }
    }

    // Request permission for iOS 13+ devices
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        // We need a user interaction to request permission.
        // We can add a hidden or explicit button, or hook it to the first interaction.
        // For this demo, we'll hook it to the body click once.
        const requestPermission = () => {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('devicemotion', handleMotion, true);
                    }
                })
                .catch(console.error);
            document.body.removeEventListener('click', requestPermission);
        };
        document.body.addEventListener('click', requestPermission);
    } else {
        // Non-iOS 13+ devices
        window.addEventListener('devicemotion', handleMotion, true);
    }
});
