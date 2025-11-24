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

    // Restore custom slider value
    const savedCustomAmount = localStorage.getItem('customAmount');
    if (savedCustomAmount) {
        customInput.value = savedCustomAmount;
        sliderValueDisplay.textContent = savedCustomAmount;
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
            localStorage.setItem('customAmount', customInput.value);
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
    }


});
