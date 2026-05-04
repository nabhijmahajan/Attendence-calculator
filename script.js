document.addEventListener('DOMContentLoaded', () => {
    const attendedInput = document.getElementById('attended');
    const totalInput = document.getElementById('total');
    const targetInput = document.getElementById('target');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results');
    const currentPercentageEl = document.getElementById('current-percentage');
    const actionRecommendationEl = document.getElementById('action-recommendation');
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutBtn = document.getElementById('close-about');

    calculateBtn.addEventListener('click', calculateAttendance);
    
    if (aboutBtn && aboutModal && closeAboutBtn) {
        aboutBtn.addEventListener('click', () => {
            aboutModal.classList.remove('hidden');
        });

        closeAboutBtn.addEventListener('click', () => {
            aboutModal.classList.add('hidden');
        });

        aboutModal.addEventListener('click', (event) => {
            if (event.target === aboutModal) {
                aboutModal.classList.add('hidden');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                aboutModal.classList.add('hidden');
            }
        });
    }

    // Allow calculation on Enter key
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateAttendance();
            }
        });
    });

    function calculateAttendance() {
        const attended = parseInt(attendedInput.value);
        const total = parseInt(totalInput.value);
        const target = parseFloat(targetInput.value);

        // Validation
        if (isNaN(attended) || isNaN(total) || isNaN(target)) {
            alert('Please enter valid numbers for all fields.');
            return;
        }

        if (attended < 0 || total <= 0 || target <= 0 || target > 100) {
            alert('Please enter realistic values (Total > 0, Attended >= 0, Target 1-100).');
            return;
        }

        if (attended > total) {
            alert('Classes attended cannot be greater than total classes held.');
            return;
        }

        // Calculations
        const currentPercentage = (attended / total) * 100;
        
        // Update UI with current percentage
        currentPercentageEl.textContent = `${currentPercentage.toFixed(2)}%`;
        
        // Color coding based on target
        if (currentPercentage >= target) {
            currentPercentageEl.className = 'percentage status-good';
            
            // Calculate how many classes can be missed
            // (attended) / (total + x) >= target/100
            // attended >= (total + x) * (target/100)
            // attended / (target/100) >= total + x
            // x <= (attended / (target/100)) - total
            const targetRatio = target / 100;
            const classesCanMiss = Math.floor(attended / targetRatio) - total;
            
            if (classesCanMiss > 0) {
                actionRecommendationEl.innerHTML = `You are on track! You can miss the next <span class="action-highlight status-good">${classesCanMiss}</span> class${classesCanMiss > 1 ? 'es' : ''} and still maintain ${target}%.`;
            } else {
                actionRecommendationEl.innerHTML = `You are exactly on track. <span class="action-highlight status-bad">Don't miss</span> your next class!`;
            }
        } else {
            currentPercentageEl.className = 'percentage status-bad';
            
            // Calculate how many consecutive classes need to be attended
            // (attended + x) / (total + x) = target/100
            // attended + x = (total + x) * (target/100)
            // attended + x = total * (target/100) + x * (target/100)
            // x - x * (target/100) = total * (target/100) - attended
            // x * (1 - target/100) = total * (target/100) - attended
            // x = (total * (target/100) - attended) / (1 - target/100)
            const targetRatio = target / 100;
            let requiredClasses = Math.ceil((total * targetRatio - attended) / (1 - targetRatio));
            
            actionRecommendationEl.innerHTML = `You need to attend the next <span class="action-highlight status-bad">${requiredClasses}</span> class${requiredClasses > 1 ? 'es' : ''} to reach ${target}%.`;
        }

        // Show results
        resultsSection.classList.remove('hidden');
        
        // Small animation effect
        resultsSection.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resultsSection.style.transform = 'scale(1)';
            resultsSection.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 10);
    }
});