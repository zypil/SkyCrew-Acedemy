// ===== PARTICLE BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particles');
    const count = 30;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 6 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.setProperty('--duration', (Math.random() * 8 + 6) + 's');
        particle.style.setProperty('--delay', (Math.random() * 5) + 's');
        container.appendChild(particle);
    }
}
createParticles();

// ===== STAR BACKGROUND =====
function createStars() {
    const container = document.getElementById('stars');
    const count = 100;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        star.style.setProperty('--delay', (Math.random() * 5) + 's');
        star.style.width = (Math.random() * 3 + 1) + 'px';
        star.style.height = star.style.width;
        container.appendChild(star);
    }
}
createStars();

// ===== DATE ON BOARDING PASS =====
document.getElementById('bp-date').textContent = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();

// ===== ENTER APP =====
function enterApp() {
    document.getElementById('intro-overlay').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('mainNav').classList.add('visible');
        animateCounters();
    }, 600);
}

// ===== SECTION NAVIGATION =====
function showSection(sectionId, navLink) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
        s.style.animation = 'none';
    });
    const target = document.getElementById(sectionId);
    target.classList.add('active');
    target.style.animation = 'sectionFade 0.6s ease';
    
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (navLink) navLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (sectionId === 'home') {
        setTimeout(animateCounters, 300);
    }
    
    if (sectionId === 'simulator' && !threeInitialized) {
        setTimeout(initThreeJS, 100);
    }
}

// ===== TAB NAVIGATION =====
function showTab(tabId, tabBtn) {
    const container = tabBtn.closest('.tab-container');
    container.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    tabBtn.classList.add('active');
}

// ===== ANIMATED COUNTERS =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        updateCounter();
    });
}

// ===== THREE.JS 3D SIMULATOR =====
let threeScene, threeCamera, threeRenderer, threePlane, threeAnimationId;
let threeInitialized = false;
let simStarted = false;

function initThreeJS() {
    if (threeInitialized) return;
    threeInitialized = true;
    
    const canvas = document.getElementById('threeCanvas');
    const container = document.getElementById('sim3dContainer');
    
    threeScene = new THREE.Scene();
    threeScene.fog = new THREE.Fog(0x0a1628, 10, 50);
    
    threeCamera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    threeCamera.position.set(0, 2, 8);
    threeCamera.lookAt(0, 0, 0);
    
    threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    threeRenderer.setSize(container.offsetWidth, container.offsetHeight);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.setClearColor(0x0a1628, 1);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    threeScene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xc9a84c, 0.8);
    dirLight.position.set(5, 10, 5);
    threeScene.add(dirLight);
    
    const pointLight = new THREE.PointLight(0xd4af37, 0.5, 20);
    pointLight.position.set(0, 3, 2);
    threeScene.add(pointLight);
    
    // Create airplane
    const planeGroup = new THREE.Group();
    
    // Fuselage
    const fuselageGeom = new THREE.CylinderGeometry(0.4, 0.3, 4, 16);
    const fuselageMat = new THREE.MeshPhongMaterial({ 
        color: 0xf0f4f8, 
        shininess: 100,
        specular: 0x444444
    });
    const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat);
    fuselage.rotation.z = Math.PI / 2;
    planeGroup.add(fuselage);
    
    // Nose
    const noseGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const nose = new THREE.Mesh(noseGeom, fuselageMat);
    nose.position.x = 2;
    planeGroup.add(nose);
    
    // Tail cone
    const tailGeom = new THREE.ConeGeometry(0.3, 1, 16);
    const tail = new THREE.Mesh(tailGeom, fuselageMat);
    tail.rotation.z = -Math.PI / 2;
    tail.position.x = -2.5;
    planeGroup.add(tail);
    
    // Wings
    const wingGeom = new THREE.BoxGeometry(1.5, 0.08, 4);
    const wingMat = new THREE.MeshPhongMaterial({ 
        color: 0xc9a84c,
        shininess: 80
    });
    const wings = new THREE.Mesh(wingGeom, wingMat);
    wings.position.x = 0.3;
    planeGroup.add(wings);
    
    // Tail wings
    const tailWingGeom = new THREE.BoxGeometry(0.8, 0.06, 1.5);
    const tailWings = new THREE.Mesh(tailWingGeom, wingMat);
    tailWings.position.x = -2;
    planeGroup.add(tailWings);
    
    // Vertical stabilizer
    const vStabGeom = new THREE.BoxGeometry(0.8, 1.2, 0.06);
    const vStab = new THREE.Mesh(vStabGeom, wingMat);
    vStab.position.set(-2, 0.6, 0);
    planeGroup.add(vStab);
    
    // Engines
    const engineGeom = new THREE.CylinderGeometry(0.2, 0.15, 0.8, 12);
    const engineMat = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 60 });
    
    const engineL = new THREE.Mesh(engineGeom, engineMat);
    engineL.rotation.x = Math.PI / 2;
    engineL.position.set(0.5, -0.3, 1.2);
    planeGroup.add(engineL);
    
    const engineR = new THREE.Mesh(engineGeom, engineMat);
    engineR.rotation.x = Math.PI / 2;
    engineR.position.set(0.5, -0.3, -1.2);
    planeGroup.add(engineR);
    
    // Engine glow
    const glowGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0xff6600,
        transparent: true,
        opacity: 0.8
    });
    const glowL = new THREE.Mesh(glowGeom, glowMat);
    glowL.position.set(0.5, -0.3, 1.6);
    planeGroup.add(glowL);
    
    const glowR = new THREE.Mesh(glowGeom, glowMat);
    glowR.position.set(0.5, -0.3, -1.6);
    planeGroup.add(glowR);
    
    threePlane = planeGroup;
    threeScene.add(planeGroup);
    
    // Cloud particles
    const cloudGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const cloudMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.1 
    });
    
    for (let i = 0; i < 50; i++) {
        const cloud = new THREE.Mesh(cloudGeom, cloudMat);
        cloud.position.set(
            Math.random() * 40 - 20,
            Math.random() * 10 - 5,
            Math.random() * 40 - 20
        );
        cloud.scale.set(
            Math.random() * 3 + 1,
            Math.random() * 1 + 0.5,
            Math.random() * 3 + 1
        );
        threeScene.add(cloud);
    }
    
    // Ground grid
    const gridHelper = new THREE.GridHelper(100, 50, 0x1e3a5f, 0x0f2847);
    gridHelper.position.y = -5;
    threeScene.add(gridHelper);
    
    animateThreeJS();
}

function animateThreeJS() {
    threeAnimationId = requestAnimationFrame(animateThreeJS);
    
    const time = Date.now() * 0.001;
    
    if (threePlane) {
        threePlane.position.y = Math.sin(time * 0.5) * 0.3;
        threePlane.rotation.z = Math.sin(time * 0.3) * 0.05;
        threePlane.rotation.y = Math.sin(time * 0.2) * 0.1;
        
        // Move forward effect
        threePlane.position.x = Math.sin(time * 0.1) * 2;
    }
    
    threeCamera.position.x = Math.sin(time * 0.1) * 3;
    threeCamera.lookAt(0, 0, 0);
    
    threeRenderer.render(threeScene, threeCamera);
}

// Click on 3D container to start sim
document.getElementById('sim3dContainer').addEventListener('click', function() {
    if (!simStarted) {
        simStarted = true;
        this.style.display = 'none';
        document.getElementById('simContainer').style.display = 'block';
        startSimulation();
    }
});

// Resize handler
window.addEventListener('resize', () => {
    if (threeRenderer && threeCamera) {
        const container = document.getElementById('sim3dContainer');
        threeCamera.aspect = container.offsetWidth / container.offsetHeight;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(container.offsetWidth, container.offsetHeight);
    }
});

// ===== SIMULATOR DATA =====
const scenarios = [
    {
        type: 'emergency',
        badge: 'Emergency',
        question: 'You are at 35,000 feet when a passenger in seat 14A suddenly collapses and is unresponsive. The passenger is not breathing and has no pulse. What is your FIRST action?',
        options: [
            { text: 'Immediately begin CPR and call for the AED while asking another crew member to inform the cockpit', correct: true },
            { text: 'Move the passenger to the galley area for more space before starting CPR', correct: false },
            { text: 'Wait for the Purser to arrive and give instructions before acting', correct: false },
            { text: 'Administer oxygen first and check if the passenger wakes up', correct: false }
        ],
        feedback: 'Correct! In cardiac arrest, every second counts. You must begin CPR immediately and use the AED as soon as possible. Moving the patient or waiting for instructions wastes critical time. The survival rate drops 7-10% for every minute without defibrillation.'
    },
    {
        type: 'service',
        badge: 'Service',
        question: 'A Business Class passenger complains that their special meal (kosher) was not loaded onto the aircraft. The flight is 8 hours long. How do you handle this situation?',
        options: [
            { text: 'Apologize sincerely, offer any available premium meals from First Class, provide complimentary wine, and file a service recovery report', correct: true },
            { text: 'Tell the passenger that special meals must be requested 24 hours in advance and there is nothing you can do', correct: false },
            { text: 'Offer the passenger a standard economy meal as a replacement', correct: false },
            { text: 'Ignore the complaint and continue with the regular service', correct: false }
        ],
        feedback: 'Correct! Even though the error may not be your fault, you must take ownership of the situation. Offering the best available alternative, adding complimentary items, and documenting the issue shows professionalism and commitment to service recovery.'
    },
    {
        type: 'safety',
        badge: 'Safety',
        question: 'During taxi, you notice a passenger in the emergency exit row has placed a large backpack under the seat in front of them. The exit row briefing was already completed. What do you do?',
        options: [
            { text: 'Politely ask the passenger to stow the backpack in the overhead bin and re-brief the exit row responsibilities', correct: true },
            { text: 'Allow it since the briefing is already done and the bag is under the seat, not blocking the aisle', correct: false },
            { text: 'Wait until after takeoff to ask them to move it', correct: false },
            { text: 'Move the passenger to a non-exit row seat instead', correct: false }
        ],
        feedback: 'Correct! Exit row passengers must have completely unobstructed access to the emergency exit. Any item under the seat could block evacuation. You must ensure compliance immediately and re-brief to confirm they still meet all exit row requirements.'
    },
    {
        type: 'emergency',
        badge: 'Emergency',
        question: 'The cabin fills with smoke during cruise. The captain announces "Prepare for emergency landing." You are the aft cabin crew. What is your priority action sequence?',
        options: [
            { text: 'Check cabin for fire source, move passengers away, wet towels for breathing, secure galley, brief brace position', correct: true },
            { text: 'Immediately open all exits to ventilate the cabin', correct: false },
            { text: 'Use the fire extinguisher on the smoke even if no visible flame', correct: false },
            { text: 'Evacuate passengers to the front of the aircraft immediately', correct: false }
        ],
        feedback: 'Correct! Opening exits at altitude is extremely dangerous. Your priority is to locate the fire source, protect passengers, prepare for landing, and only evacuate after the aircraft has stopped. Wet towels help passengers breathe through smoke.'
    },
    {
        type: 'service',
        badge: 'Service',
        question: 'An unaccompanied minor (UMNR) aged 9 is crying and says they feel sick during turbulence. The seatbelt sign is ON. What is your approach?',
        options: [
            { text: 'Kneel beside them (if safe), reassure them, offer water and a sick bag, notify the Purser, and stay visible until turbulence passes', correct: true },
            { text: 'Tell them to use the call button when the seatbelt sign is off', correct: false },
            { text: 'Ask an adult passenger nearby to look after them', correct: false },
            { text: 'Escort them to the lavatory immediately', correct: false }
        ],
        feedback: 'Correct! UMNRS are your responsibility. During turbulence, safety comes first - you should not walk around unnecessarily. Reassurance, being present, and preparing for sickness while seated is the safest and most caring approach.'
    },
    {
        type: 'safety',
        badge: 'Safety',
        question: 'A passenger insists on using the lavatory while the seatbelt sign is ON and the aircraft is experiencing moderate turbulence. They become aggressive when denied. How do you respond?',
        options: [
            { text: 'Calmly explain the safety risk, offer alternatives (sick bag, water), involve the Purser if aggression escalates, and document the incident', correct: true },
            { text: 'Allow them to go since it is their right as a paying passenger', correct: false },
            { text: 'Physically restrain them in their seat', correct: false },
            { text: 'Threaten to have them arrested upon landing', correct: false }
        ],
        feedback: 'Correct! Safety regulations override passenger demands. You must remain calm, explain professionally, offer alternatives, and escalate to the Purser/Captain if needed. Physical restraint is only for imminent danger, not for lavatory disputes.'
    },
    {
        type: 'emergency',
        badge: 'Emergency',
        question: 'During a water ditching evacuation, you are at Door 2L. The slide/raft has deployed but is partially submerged and unstable. Passengers are panicking at the door. What do you do?',
        options: [
            { text: 'Direct passengers to the opposite side door if available, or instruct them to jump into the water and swim to the raft, then inflate your life vest', correct: true },
            { text: 'Force passengers onto the unstable raft anyway to get them off the aircraft quickly', correct: false },
            { text: 'Close the door and redirect everyone to the overwing exits only', correct: false },
            { text: 'Jump into the raft yourself first to test its stability', correct: false }
        ],
        feedback: 'Correct! An unstable raft is dangerous and could capsize. Redirecting to usable exits or having passengers swim to the raft (with life vests inflated) is safer. You must never test equipment by using it yourself first - your job is to direct passengers.'
    },
    {
        type: 'service',
        badge: 'Service',
        question: 'A passenger in Economy claims they were promised an upgrade at check-in but their seat shows Economy. They are demanding to speak to the Captain. How do you handle this?',
        options: [
            { text: 'Empathize, check the manifest for any available seats, offer complimentary amenities if no upgrade is possible, and never promise what you cannot deliver', correct: true },
            { text: 'Tell them the Captain does not handle seating disputes and they must contact ground staff after landing', correct: false },
            { text: 'Upgrade them immediately to Business Class to avoid conflict', correct: false },
            { text: 'Ignore them and focus on other passengers', correct: false }
        ],
        feedback: 'Correct! Never escalate to the Captain for service issues. Check facts, offer what you can within policy, and use service recovery tools (amenities, miles, vouchers). Upgrading without authorization violates policy and creates fairness issues.'
    },
    {
        type: 'safety',
        badge: 'Safety',
        question: 'You smell a strong electrical burning odor near the aft galley. There is no visible smoke yet. What is your immediate action?',
        options: [
            { text: 'Identify and isolate the source by switching off galley power, notify the cockpit immediately, prepare fire equipment, and monitor closely', correct: true },
            { text: 'Spray the galley with the fire extinguisher immediately as a precaution', correct: false },
            { text: 'Open the galley compartments to find the source', correct: false },
            { text: 'Wait to see if smoke appears before taking action', correct: false }
        ],
        feedback: 'Correct! Electrical fires require isolation first. Using extinguisher prematurely can spread the problem. Opening compartments feeds oxygen to a potential fire. Waiting is dangerous. Isolate power, inform cockpit, and stand ready with equipment.'
    },
    {
        type: 'emergency',
        badge: 'Emergency',
        question: 'After an emergency landing, you are evacuating passengers through your assigned door. A passenger stops to retrieve their luggage from the overhead bin. The cabin behind them is filling with smoke. What do you do?',
        options: [
            { text: 'Firmly shout "Leave everything, GO NOW!" and physically guide them out if they hesitate - luggage costs lives in evacuations', correct: true },
            { text: 'Allow them to quickly grab their bag since it will only take a few seconds', correct: false },
            { text: 'Move to another passenger and leave them behind', correct: false },
            { text: 'Politely ask them to reconsider while waiting patiently', correct: false }
        ],
        feedback: 'Correct! In evacuations, seconds mean lives. The FAA states that retrieving luggage is a major cause of evacuation fatalities. You must use firm, loud commands and physical guidance if necessary. "Leave everything" is a standard evacuation command for a reason.'
    }
];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let answered = false;

function startSimulation() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    updateStats();
    showQuestion();
}

function updateStats() {
    const scoreEl = document.getElementById('simScore');
    const qEl = document.getElementById('simQuestion');
    const streakEl = document.getElementById('simStreak');
    
    scoreEl.textContent = score;
    qEl.textContent = currentQuestion + 1;
    streakEl.textContent = streak;
    
    // Pop animation
    scoreEl.classList.add('pop');
    setTimeout(() => scoreEl.classList.remove('pop'), 300);
}

function showQuestion() {
    answered = false;
    const scenario = scenarios[currentQuestion];
    const simBody = document.getElementById('simBody');
    
    let optionsHTML = '';
    scenario.options.forEach((opt, idx) => {
        optionsHTML += `
            <button class="option-btn" onclick="selectOption(${idx})" id="opt-${idx}">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${opt.text}</span>
            </button>
        `;
    });

    simBody.innerHTML = `
        <div class="scenario-card">
            <div class="scenario-header">
                <span class="scenario-badge badge-${scenario.type}">${scenario.badge}</span>
                <span style="color: var(--text-muted); font-size: 0.85rem;">Question ${currentQuestion + 1} of ${scenarios.length}</span>
            </div>
            <div class="scenario-question">${scenario.question}</div>
            <div class="scenario-options">${optionsHTML}</div>
            <div id="feedback-area"></div>
        </div>
    `;
}

function selectOption(idx) {
    if (answered) return;
    answered = true;
    
    const scenario = scenarios[currentQuestion];
    const selected = scenario.options[idx];
    const btn = document.getElementById(`opt-${idx}`);
    
    if (selected.correct) {
        btn.classList.add('correct');
        streak++;
        const points = 100 + (streak > 2 ? streak * 20 : 0);
        score += points;
        document.getElementById('feedback-area').innerHTML = `
            <div class="feedback-box feedback-correct">
                <strong><i class="fas fa-check-circle"></i> Correct! (+${points} points)</strong><br><br>
                ${scenario.feedback}
            </div>
            ${currentQuestion < scenarios.length - 1 ? `<button class="next-btn" onclick="nextQuestion()"><i class="fas fa-arrow-right"></i> Next Scenario</button>` : `<button class="next-btn" onclick="showResults()"><i class="fas fa-flag-checkered"></i> View Results</button>`}
        `;
    } else {
        btn.classList.add('wrong');
        streak = 0;
        const correctIdx = scenario.options.findIndex(o => o.correct);
        document.getElementById(`opt-${correctIdx}`).classList.add('correct');
        document.getElementById('feedback-area').innerHTML = `
            <div class="feedback-box feedback-wrong">
                <strong><i class="fas fa-times-circle"></i> Incorrect</strong><br><br>
                ${scenario.feedback}
            </div>
            ${currentQuestion < scenarios.length - 1 ? `<button class="next-btn" onclick="nextQuestion()"><i class="fas fa-arrow-right"></i> Next Scenario</button>` : `<button class="next-btn" onclick="showResults()"><i class="fas fa-flag-checkered"></i> View Results</button>`}
        `;
    }
    
    updateStats();
}

function nextQuestion() {
    currentQuestion++;
    updateStats();
    showQuestion();
}

function showResults() {
    const simBody = document.getElementById('simBody');
    const maxScore = scenarios.length * 100;
    const percentage = Math.round((score / maxScore) * 100);
    let badgeClass = 'badge-bronze';
    let badgeText = 'Cabin Crew Trainee';
    let message = 'Keep studying! Review the training modules and try again.';
    
    if (percentage >= 80) {
        badgeClass = 'badge-gold';
        badgeText = 'SkyCrew Elite';
        message = 'Outstanding! You have the instincts of a senior cabin crew member. Ready for the real skies!';
    } else if (percentage >= 60) {
        badgeClass = 'badge-silver';
        badgeText = 'Flight Attendant Ready';
        message = 'Great job! You are well-prepared for cabin crew training. A few areas to brush up on.';
    }
    
    simBody.innerHTML = `
        <div class="result-screen">
            <div style="font-size: 4rem; margin-bottom: 1rem;"><i class="fas fa-trophy" style="color: var(--accent);"></i></div>
            <div class="result-score">${percentage}%</div>
            <div class="result-badge ${badgeClass}">${badgeText}</div>
            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 2rem; line-height: 1.7;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <div style="text-align: center; padding: 1rem 2rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">${score}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Total Score</div>
                </div>
                <div style="text-align: center; padding: 1rem 2rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">${scenarios.length}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Scenarios</div>
                </div>
                <div style="text-align: center; padding: 1rem 2rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">${Math.round(score / 100)}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Correct</div>
                </div>
            </div>
            <div style="margin-top: 2rem;">
                <button class="start-sim-btn" onclick="startSimulation()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="start-sim-btn" style="margin-left: 1rem; background: transparent; border: 2px solid var(--accent); color: var(--accent);" onclick="showSection('training', document.querySelectorAll('.nav-links a')[3])">
                    <i class="fas fa-book"></i> Study Training
                </button>
            </div>
        </div>
    `;
}