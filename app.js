/**
 * HUNTING WILL — Smart Education & Companion for Slow Learners
 * Core Application Logic & Interactivity
 */

// ==========================================================================
// 1. STATE & STORAGE
// ==========================================================================

const DEFAULT_STATE = {
  character: 'nova',
  charLevel: 2,
  charXp: 780,
  charXpMax: 1000,
  charTier: 2,
  coins: 350,
  cgpa: 7.42,
  targetCgpa: 8.00,
  semesters: [
    { sem: 'Sem 1', sgpa: 6.30, completed: true },
    { sem: 'Sem 2', sgpa: 6.85, completed: true },
    { sem: 'Sem 3', sgpa: 7.40, completed: true },
    { sem: 'Sem 4', sgpa: 7.80, completed: true },
    { sem: 'Sem 5', sgpa: 8.10, target: true },
    { sem: 'Sem 6', sgpa: 8.20, target: true },
    { sem: 'Sem 7', sgpa: 8.30, target: true },
    { sem: 'Sem 8', sgpa: 8.40, target: true }
  ],
  monthlyCert: {
    title: 'Python & Data Foundations Primer',
    progress: 75,
    completed: false
  },
  yearlyCerts: {
    target: 4,
    completed: 2
  },
  quests: [
    { id: 'q1', title: 'Review Tree Traversal Mindmap (15 mins)', xp: 40, coins: 20, done: true },
    { id: 'q2', title: 'Mark Daily Class Attendance', xp: 30, coins: 15, done: true },
    { id: 'q3', title: 'Ask ChatGBP 1 Doubt in ELI5 Mode', xp: 50, coins: 25, done: false },
    { id: 'q4', title: 'Explain 1 Concept to Yourself out loud', xp: 60, coins: 30, done: false }
  ],
  subjects: [
    { id: 's1', name: 'Data Structures & Algorithms', attended: 28, total: 34 },
    { id: 's2', name: 'Operating Systems & Concurrency', attended: 22, total: 30 },
    { id: 's3', name: 'Database Management Systems', attended: 26, total: 32 },
    { id: 's4', name: 'Engineering Mathematics III', attended: 19, total: 28 }
  ],
  reminders: [
    { id: 'r1', date: '2026-10-12', title: 'DSA Mid-Sem Mindmap Review', category: 'revision' },
    { id: 'r2', date: '2026-10-18', title: 'Python Certificate Capstone Quiz', category: 'certificate' },
    { id: 'r3', date: '2026-10-25', title: 'DBMS Lab Assignment Submission', category: 'assignment' },
    { id: 'r4', date: '2026-11-04', title: 'Semester Theory Exams Begin', category: 'exam' }
  ],
  unlockedTips: ['tip-1'],
  antiTopperMode: true
};

let appState = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem('hunting_will_state');
    if (saved) {
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  return { ...DEFAULT_STATE };
}

function saveState() {
  try {
    localStorage.setItem('hunting_will_state', JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

// Character definitions
const CHARACTERS = {
  nova: {
    name: 'Nova',
    image: 'assets/nova.jpg',
    trait: 'Cyber Runner • High Agility Mind',
    classTitle: 'Cyber Tech Prodigy • High Focus Agility',
    color: '#06b6d4',
    quote: '"Take your time, fellow Hunter! Even quantum computers process one instruction at a time."'
  },
  aria: {
    name: 'Aria',
    image: 'assets/aria.jpg',
    trait: 'Zen Alchemist • Cozy Lo-Fi Vibe',
    classTitle: 'Mindful Scholar • Anxiety Reducer',
    color: '#10b981',
    quote: '"Deep breath. You do not need to learn everything in a day. One clean concept every morning builds empires."'
  },
  blitz: {
    name: 'Blitz',
    image: 'assets/blitz.jpg',
    trait: 'Pixel Knight • Relentless Grinder',
    classTitle: 'Gamer Tactician • Boss Slayer',
    color: '#f59e0b',
    quote: '"Each tough topic is just a mini-boss! We die, we learn the attack pattern, and then we crush it!"'
  },
  kairo: {
    name: 'Kairo',
    image: 'assets/kairo.jpg',
    trait: 'Cosmic Sage • Deep Thinker',
    classTitle: 'Celestial Thinker • Conceptual Master',
    color: '#8b5cf6',
    quote: '"Speed of memorization is temporary; visual depth of intuition lasts a lifetime. You are doing fantastic."'
  }
};

const MOTIVATIONAL_QUOTES = [
  "You don't need to be the fastest runner, just stay on the track. Slow growth is still permanent growth.",
  "Your brain isn't slow — it just demands high-definition visual understanding before storing concepts.",
  "Toppers memorize for exams; slow, deep thinkers remember for life.",
  "Never compare your Chapter 2 to somebody else's Chapter 20.",
  "A 1% improvement every single day compounds to 37x in a year.",
  "Patience is your superpower. While rushed learners make careless bugs, your deliberate pace builds solid foundations.",
  "Smart education isn't about rushing 100 pages; it's about making 4 crucial concepts crystal clear.",
  "Every expert you admire was once overwhelmed and utterly confused.",
  "Mistakes aren't failures — they are simply cognitive checkpoints in your leveling journey."
];

// ==========================================================================
// 2. WEB AUDIO SYNTHESIZER (LO-FI AMBIENCE & SOUND FX)
// ==========================================================================

let audioCtx = null;
let isAudioPlaying = false;
let ambientGainNode = null;
let noiseSource = null;
let droneOsc = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
}

function toggleLoFiAmbience() {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const btn = document.getElementById('toggle-audio-btn');
  const label = document.getElementById('audio-label');
  const volInput = document.getElementById('audio-volume');

  if (isAudioPlaying) {
    // Stop
    if (ambientGainNode) {
      ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, audioCtx.currentTime);
      ambientGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (droneOsc) { try { droneOsc.stop(); } catch(e){} }
        if (noiseSource) { try { noiseSource.stop(); } catch(e){} }
        isAudioPlaying = false;
        btn.classList.remove('playing');
        label.textContent = 'Lo-Fi Study Focus';
      }, 800);
    }
  } else {
    // Start gentle pink noise rain + 432Hz binaural study drone
    ambientGainNode = audioCtx.createGain();
    const targetVol = (volInput.value / 100) * 0.15;
    ambientGainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    ambientGainNode.gain.exponentialRampToValueAtTime(targetVol, audioCtx.currentTime + 1.2);
    ambientGainNode.connect(audioCtx.destination);

    // Warm Drone Oscillator
    droneOsc = audioCtx.createOscillator();
    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(108, audioCtx.currentTime); // 108Hz resonant ground
    const droneFilter = audioCtx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
    droneOsc.connect(droneFilter);
    droneFilter.connect(ambientGainNode);
    droneOsc.start();

    // Soft Rain / Lo-fi Pink Noise buffer
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.07;
    }

    noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, audioCtx.currentTime);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(ambientGainNode);
    noiseSource.start();

    isAudioPlaying = true;
    btn.classList.add('playing');
    label.textContent = 'Playing Focus Beats';
    showToast('Lo-Fi Ambience Activated 🎧 Focus mode on!');
  }
}

// Sound FX chimes
function playChime(freq = 520, type = 'sine', duration = 0.25) {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playCoinSound() {
  playChime(987.77, 'sine', 0.15); // B5
  setTimeout(() => playChime(1318.51, 'triangle', 0.25), 100); // E6
}

function playLevelUpFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => playChime(freq, 'triangle', 0.3), idx * 120);
  });
}

// ==========================================================================
// 3. AMBIENT BACKGROUND CANVAS PARTICLES
// ==========================================================================

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    requestAnimationFrame(render);
  }
  render();
}

// Confetti burst for Level Up & Achievements
function triggerConfettiBurst() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const pieces = [];
  const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#fff'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    let alive = false;
    for (let p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotSpeed;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    }
    frames++;
    if (alive && frames < 120) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }
  animate();
}

// Toast helper
function showToast(message, type = 'normal') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'coin' ? 'toast-coin' : type === 'success' ? 'toast-success' : ''}`;
  
  let icon = '<i class="fa-solid fa-sparkles"></i>';
  if (type === 'coin') icon = '<i class="fa-solid fa-coins text-gold"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check text-emerald"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 4. UI UPDATE ROUTINES
// ==========================================================================

function updateHeaderAndStats() {
  const char = CHARACTERS[appState.character] || CHARACTERS.nova;

  // Header
  document.getElementById('header-avatar-img').src = char.image;
  document.getElementById('header-char-name').textContent = char.name;
  document.getElementById('header-char-lvl').textContent = `Lvl ${appState.charLevel} • Tier ${appState.charTier}`;
  document.getElementById('user-coins-display').textContent = appState.coins;
  const vaultCoins = document.getElementById('vault-coins-amount');
  if (vaultCoins) vaultCoins.textContent = appState.coins;

  // Character Tab View
  document.getElementById('active-character-portrait').src = char.image;
  document.getElementById('char-name-display').textContent = char.name;
  document.getElementById('char-class-display').textContent = char.classTitle;
  document.getElementById('char-level-display').textContent = appState.charLevel;
  document.getElementById('char-quote-display').textContent = char.quote;

  const tierNames = ['Spark', 'Core Breaker', 'Aura Knight', 'Grand Archon'];
  const currentTierName = tierNames[appState.charTier - 1] || 'Core Breaker';
  document.getElementById('char-tier-badge').innerHTML = `<i class="fa-solid fa-fire"></i> Tier ${appState.charTier}: ${currentTierName}`;

  // XP Bar
  const xpPct = Math.min(100, Math.round((appState.charXp / appState.charXpMax) * 100));
  document.getElementById('char-xp-bar').style.width = `${xpPct}%`;
  document.getElementById('char-xp-text').textContent = `${appState.charXp} / ${appState.charXpMax} XP`;

  // Energy Aura Color based on character
  const aura = document.getElementById('character-aura');
  if (aura) {
    aura.style.background = `radial-gradient(circle, ${char.color}88 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)`;
  }

  // Update Evolution Tier step highlights
  const tierSteps = document.querySelectorAll('.tier-step');
  tierSteps.forEach((step, idx) => {
    step.classList.remove('completed', 'active', 'locked');
    if (idx + 1 < appState.charTier) {
      step.classList.add('completed');
    } else if (idx + 1 === appState.charTier) {
      step.classList.add('active');
    } else {
      step.classList.add('locked');
    }
  });

  // Monthly & Yearly Certs
  const certProgress = document.getElementById('monthly-cert-progress');
  if (certProgress) {
    certProgress.style.width = `${appState.monthlyCert.progress}%`;
  }
  const completeCertBtn = document.getElementById('complete-monthly-cert-btn');
  if (completeCertBtn) {
    if (appState.monthlyCert.completed) {
      completeCertBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> Completed!';
      completeCertBtn.disabled = true;
      completeCertBtn.style.opacity = '0.6';
    } else {
      completeCertBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mark Complete (+200 Coins)';
      completeCertBtn.disabled = false;
      completeCertBtn.style.opacity = '1';
    }
  }

  const yearlyCountDisplay = document.getElementById('yearly-cert-count');
  if (yearlyCountDisplay) {
    yearlyCountDisplay.textContent = `${appState.yearlyCerts.completed} / ${appState.yearlyCerts.target} Finished`;
  }

  // CGPA View
  document.getElementById('current-cgpa-display').textContent = appState.cgpa.toFixed(2);
  document.getElementById('target-cgpa-display').textContent = appState.targetCgpa.toFixed(2);

  // Render Semesters & Calc
  renderSemesterBars();

  // Render Quests
  renderQuests();

  // Render Attendance & Overall
  renderAttendance();

  // Render Reminders
  renderReminders();

  // Render Secret Tips
  renderVaultTips();
}

// Add XP and handle level up
function addXP(amount) {
  appState.charXp += amount;
  if (appState.charXp >= appState.charXpMax) {
    // Level Up!
    appState.charLevel += 1;
    appState.charXp = appState.charXp - appState.charXpMax;
    appState.charXpMax = Math.round(appState.charXpMax * 1.25);
    appState.coins += 100;
    
    // Check tier promotion (every 2 levels)
    if (appState.charLevel % 2 === 1 && appState.charTier < 4) {
      appState.charTier += 1;
      showToast(`🔥 EVOLUTION TIER UNLOCKED! You are now Tier ${appState.charTier}!`, 'success');
    }

    playLevelUpFanfare();
    triggerConfettiBurst();
    showToast(`🎉 LEVEL UP! You reached Level ${appState.charLevel}! (+100 Bonus Coins)`, 'success');
  } else {
    playChime(600, 'triangle', 0.2);
    showToast(`+${amount} XP Earned! Keep going!`);
  }
  saveState();
  updateHeaderAndStats();
}

function addCoins(amount, silent = false) {
  appState.coins += amount;
  if (!silent) {
    playCoinSound();
    showToast(`+${amount} Will Coins added to your vault! 🪙`, 'coin');
  }
  saveState();
  updateHeaderAndStats();
}

// ==========================================================================
// 5. SEMESTER & CGPA GRAPH
// ==========================================================================

function renderSemesterBars() {
  const container = document.getElementById('sem-bars-container');
  if (!container) return;
  container.innerHTML = '';

  appState.semesters.forEach((sem, idx) => {
    const col = document.createElement('div');
    col.className = 'sem-bar-col';

    const heightPct = (sem.sgpa / 10) * 100;
    const isTarget = sem.target;
    const isLatestCompleted = !sem.target && (idx === 3);

    col.innerHTML = `
      <div class="sem-bar-fill ${isTarget ? 'target' : ''} ${isLatestCompleted ? 'highlight' : ''}" style="height: ${heightPct}%;">
        <span class="sem-bar-val">${sem.sgpa.toFixed(1)}</span>
      </div>
      <span class="sem-bar-label">${sem.sem}</span>
    `;
    container.appendChild(col);
  });

  // Calculate required SGPA for remaining target semesters
  const completedSems = appState.semesters.filter(s => s.completed);
  const remainingSems = appState.semesters.filter(s => s.target);
  
  if (completedSems.length > 0 && remainingSems.length > 0) {
    const completedSum = completedSems.reduce((acc, cur) => acc + cur.sgpa, 0);
    const totalCount = appState.semesters.length;
    const targetSum = appState.targetCgpa * totalCount;
    const neededSum = targetSum - completedSum;
    const neededAvg = (neededSum / remainingSems.length).toFixed(2);
    
    const reqElem = document.getElementById('req-sgpa-value');
    if (reqElem) {
      reqElem.textContent = `${neededAvg} SGPA`;
    }
  }
}

// ==========================================================================
// 6. QUESTS RENDER & INTERACTION
// ==========================================================================

function renderQuests() {
  const list = document.getElementById('quest-items-list');
  if (!list) return;
  list.innerHTML = '';

  appState.quests.forEach(quest => {
    const li = document.createElement('li');
    li.className = 'quest-item';
    li.innerHTML = `
      <div class="quest-left">
        <button class="quest-check-btn ${quest.done ? 'checked' : ''}" data-id="${quest.id}" title="Toggle Complete">
          <i class="fa-solid fa-check"></i>
        </button>
        <span class="quest-title-text ${quest.done ? 'done' : ''}">${quest.title}</span>
      </div>
      <div class="quest-reward">
        <span>+${quest.xp} XP</span>
        <span>•</span>
        <span><i class="fa-solid fa-coins"></i> +${quest.coins}</span>
      </div>
    `;

    li.querySelector('.quest-check-btn').addEventListener('click', () => {
      quest.done = !quest.done;
      if (quest.done) {
        addXP(quest.xp);
        addCoins(quest.coins);
      } else {
        saveState();
        updateHeaderAndStats();
      }
    });

    list.appendChild(li);
  });
}

// ==========================================================================
// 7. ATTENDANCE TRACKER & SAFE-BUNK CALCULATOR
// ==========================================================================

function calculateSubjectStatus(attended, total) {
  const pct = total === 0 ? 0 : (attended / total) * 100;
  let statusClass = 'pct-safe';
  let adviceText = '';
  let adviceClass = 'can-bunk';

  if (pct >= 75) {
    statusClass = 'pct-safe';
    // Max safe bunks = floor((attended - 0.75 * total) / 0.75)
    const safeBunks = Math.floor((attended - 0.75 * total) / 0.75);
    if (safeBunks > 0) {
      adviceText = `🎉 Can safely bunk ${safeBunks} class${safeBunks > 1 ? 'es' : ''}`;
      adviceClass = 'can-bunk';
    } else {
      adviceText = `⚠️ On border (75%). Don't skip next class!`;
      adviceClass = 'must-attend';
    }
  } else {
    statusClass = pct >= 65 ? 'pct-warning' : 'pct-danger';
    // Classes needed to reach 75% = ceil((0.75 * total - attended) / (1 - 0.75))
    const neededClasses = Math.ceil((0.75 * total - attended) / 0.25);
    adviceText = `🚨 Must attend next ${neededClasses} class${neededClasses > 1 ? 'es' : ''} to hit 75%`;
    adviceClass = 'must-attend';
  }

  return { pct, statusClass, adviceText, adviceClass };
}

function renderAttendance() {
  const container = document.getElementById('subjects-list-container');
  if (!container) return;
  container.innerHTML = '';

  let totalAttended = 0;
  let totalHeld = 0;

  appState.subjects.forEach(sub => {
    totalAttended += sub.attended;
    totalHeld += sub.total;

    const calc = calculateSubjectStatus(sub.attended, sub.total);

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subject-top-row">
        <h4 class="subject-name">${sub.name}</h4>
        <span class="subject-pct-badge ${calc.statusClass}">${calc.pct.toFixed(1)}%</span>
      </div>

      <div class="subject-progress-track">
        <div class="subject-progress-fill" style="width: ${Math.min(100, calc.pct)}%; background: ${calc.pct >= 75 ? 'var(--accent-emerald)' : calc.pct >= 65 ? 'var(--accent-gold)' : 'var(--accent-rose)'};"></div>
      </div>

      <div class="subject-bottom-row">
        <div class="bunk-advice-pill ${calc.adviceClass}">
          ${calc.adviceText}
        </div>

        <div class="attendance-actions-btns">
          <span style="font-size:0.75rem; color:var(--text-muted); margin-right:4px;">${sub.attended}/${sub.total} Held</span>
          <button class="btn-attend-present" data-id="${sub.id}">+ Present</button>
          <button class="btn-attend-absent" data-id="${sub.id}">+ Absent</button>
        </div>
      </div>
    `;

    // Handlers
    card.querySelector('.btn-attend-present').addEventListener('click', () => {
      sub.attended += 1;
      sub.total += 1;
      addCoins(5, true);
      addXP(15);
      showToast(`Logged Present for ${sub.name}! (+5 Coins)`, 'coin');
      saveState();
      updateHeaderAndStats();
    });

    card.querySelector('.btn-attend-absent').addEventListener('click', () => {
      sub.total += 1;
      showToast(`Logged Absent for ${sub.name}. Check your safe bunk status!`);
      saveState();
      updateHeaderAndStats();
    });

    container.appendChild(card);
  });

  // Overall attendance calculation
  const overallPct = totalHeld === 0 ? 0 : (totalAttended / totalHeld) * 100;
  const overallDisplay = document.getElementById('overall-attendance-pct');
  const overallStatus = document.getElementById('overall-status-pill');
  
  if (overallDisplay) {
    overallDisplay.textContent = `${overallPct.toFixed(1)}%`;
  }
  if (overallStatus) {
    if (overallPct >= 75) {
      overallStatus.className = 'summary-status-pill safe';
      overallStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Safe Zone (>75% Met)';
    } else {
      overallStatus.className = 'summary-status-pill danger';
      overallStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Danger Zone (<75%)';
    }
  }

  const attendedCount = document.getElementById('total-attended-count');
  if (attendedCount) attendedCount.textContent = totalAttended;
  const heldCount = document.getElementById('total-held-count');
  if (heldCount) heldCount.textContent = totalHeld;
}

// ==========================================================================
// 8. INTERACTIVE CALENDAR & REMINDERS
// ==========================================================================

let currentCalendarMonth = 9; // October (0-indexed: 9 = October)
let currentCalendarYear = 2026;
let selectedDateStr = '2026-10-09';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderCalendar() {
  const monthTitle = document.getElementById('cal-month-title');
  const grid = document.getElementById('calendar-days-grid');
  if (!monthTitle || !grid) return;

  monthTitle.textContent = `${MONTH_NAMES[currentCalendarMonth]} ${currentCalendarYear}`;
  grid.innerHTML = '';

  const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  // Previous month trailing cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.textContent = day;
    grid.appendChild(cell);
  }

  // Current month cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.textContent = day;

    const monthStr = String(currentCalendarMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${currentCalendarYear}-${monthStr}-${dayStr}`;

    // Highlight today (Oct 9, 2026)
    if (dateKey === '2026-10-09') {
      cell.classList.add('today');
    }

    if (dateKey === selectedDateStr) {
      cell.classList.add('selected');
    }

    // Check if event exists
    const hasEvent = appState.reminders.some(r => r.date === dateKey);
    if (hasEvent) {
      const dot = document.createElement('span');
      dot.className = 'cal-event-dot';
      cell.appendChild(dot);
    }

    cell.addEventListener('click', () => {
      selectedDateStr = dateKey;
      renderCalendar();
      renderReminders();
    });

    grid.appendChild(cell);
  }
}

function renderReminders() {
  const list = document.getElementById('reminders-list');
  const heading = document.getElementById('selected-date-heading');
  const badge = document.getElementById('reminder-count-badge');
  if (!list) return;

  list.innerHTML = '';
  
  if (heading) {
    heading.textContent = `Reminders & Events (${selectedDateStr})`;
  }

  // Filter for selected date or show all upcoming if none on this date
  const dateEvents = appState.reminders.filter(r => r.date === selectedDateStr);
  const eventsToShow = dateEvents.length > 0 ? dateEvents : appState.reminders;

  if (badge) {
    badge.textContent = `${eventsToShow.length} Event${eventsToShow.length !== 1 ? 's' : ''}`;
  }

  if (eventsToShow.length === 0) {
    list.innerHTML = `
      <li style="font-size:0.85rem; color:var(--text-muted); padding:0.5rem; text-align:center;">
        No events scheduled for this day. Click 'Add Reminder' to schedule!
      </li>
    `;
    return;
  }

  eventsToShow.forEach(rem => {
    const li = document.createElement('li');
    li.className = 'reminder-item';

    let catIcon = 'fa-bell';
    let catClass = 'cat-revision';
    if (rem.category === 'exam') { catIcon = 'fa-file-signature'; catClass = 'cat-exam'; }
    if (rem.category === 'assignment') { catIcon = 'fa-folder'; catClass = 'cat-assignment'; }
    if (rem.category === 'certificate') { catIcon = 'fa-award'; catClass = 'cat-certificate'; }

    li.innerHTML = `
      <div class="reminder-left">
        <div class="reminder-cat-badge ${catClass}">
          <i class="fa-solid ${catIcon}"></i>
        </div>
        <div class="reminder-details">
          <span class="reminder-title">${rem.title}</span>
          <span class="reminder-date-text"><i class="fa-regular fa-clock"></i> ${rem.date} • ${rem.category.toUpperCase()}</span>
        </div>
      </div>
      <button class="reminder-del-btn" data-id="${rem.id}" title="Remove Reminder">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;

    li.querySelector('.reminder-del-btn').addEventListener('click', () => {
      appState.reminders = appState.reminders.filter(r => r.id !== rem.id);
      saveState();
      renderCalendar();
      renderReminders();
      showToast('Reminder deleted!');
    });

    list.appendChild(li);
  });
}

// ==========================================================================
// 9. INTERACTIVE SVG MINDMAP ENGINE
// ==========================================================================

const MINDMAP_DATA = {
  dsa: {
    title: 'Data Structures: Trees & Graphs Simplified',
    nodes: [
      { id: 'root', label: 'Hierarchical DS', type: 'root', x: 260, y: 220, info: 'Non-linear data structures used for fast search, routing, and hierarchical storage. Much simpler when pictured like a family tree!' },
      { id: 'b-tree', label: 'Binary Trees', type: 'branch', x: 140, y: 110, info: 'Each node has at most 2 children (Left & Right). Think of making a YES/NO decision branch.' },
      { id: 'bst', label: 'BST Search', type: 'leaf', x: 60, y: 50, info: 'Left is smaller, Right is larger. 80/20 Exam Focus: Always brings O(log N) search questions.' },
      { id: 'traversals', label: 'In/Pre/Post Order', type: 'leaf', x: 60, y: 170, info: 'In-order traversal of BST gives strictly sorted array! Top repeated exam question.' },
      { id: 'graphs', label: 'Graphs (G = V, E)', type: 'branch', x: 420, y: 110, info: 'Vertices (cities/nodes) connected by Edges (roads/wires). Can be directed or undirected.' },
      { id: 'bfs', label: 'BFS (Breadth First)', type: 'leaf', x: 500, y: 50, info: 'Level-by-level ripple search. Uses Queue (FIFO). Shortest path in unweighted graphs!' },
      { id: 'dfs', label: 'DFS (Depth First)', type: 'leaf', x: 510, y: 170, info: 'Goes as deep as possible first. Uses Stack (Recursion/LIFO). Ideal for maze solving.' },
      { id: 'hashing', label: 'Hash Maps (O(1))', type: 'branch', x: 260, y: 350, info: 'Key-value pairs using a hash function. Fast instant lookup like an index at the back of a textbook.' },
      { id: 'collision', label: 'Chaining vs Probing', type: 'leaf', x: 260, y: 440, info: 'When two keys have identical hash. Chaining uses linked lists, probing checks next slot.' }
    ],
    links: [
      { source: 'root', target: 'b-tree' },
      { source: 'b-tree', target: 'bst' },
      { source: 'b-tree', target: 'traversals' },
      { source: 'root', target: 'graphs' },
      { source: 'graphs', target: 'bfs' },
      { source: 'graphs', target: 'dfs' },
      { source: 'root', target: 'hashing' },
      { source: 'hashing', target: 'collision' }
    ]
  },
  os: {
    title: 'Operating Systems: Deadlock & Concurrency',
    nodes: [
      { id: 'root', label: 'OS Concurrency', type: 'root', x: 260, y: 220, info: 'How the operating system coordinates multiple tasks without crashing or starving processes.' },
      { id: 'deadlock', label: 'Deadlock 4 Conditions', type: 'branch', x: 130, y: 120, info: 'The 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Must memorize for exams!' },
      { id: 'bankers', label: "Banker's Algorithm", type: 'leaf', x: 60, y: 60, info: 'Safe state vs Unsafe state avoidance algorithm. Guarantees 10-15 marks in university papers!' },
      { id: 'semaphore', label: 'Semaphores & Mutex', type: 'branch', x: 420, y: 120, info: 'Traffic lights for code! Mutex = 1 key for bathroom; Semaphore = count of available parking spots.' },
      { id: 'race', label: 'Race Condition', type: 'leaf', x: 500, y: 60, info: 'When 2 threads write to same variable concurrently, corrupting output. Fixed with locks.' },
      { id: 'scheduling', label: 'CPU Scheduling', type: 'branch', x: 260, y: 350, info: 'Deciding which process gets the CPU next (FCFS, SJF, Round Robin with Time Quantum).' }
    ],
    links: [
      { source: 'root', target: 'deadlock' },
      { source: 'deadlock', target: 'bankers' },
      { source: 'root', target: 'semaphore' },
      { source: 'semaphore', target: 'race' },
      { source: 'root', target: 'scheduling' }
    ]
  },
  dbms: {
    title: 'DBMS: Normalization & ACID Properties',
    nodes: [
      { id: 'root', label: 'Relational DBMS', type: 'root', x: 260, y: 220, info: 'Structured tables connected through primary and foreign keys.' },
      { id: 'norm', label: 'Normalization', type: 'branch', x: 130, y: 120, info: 'Removing data redundancy and insertion/deletion anomalies.' },
      { id: '1nf-3nf', label: '1NF, 2NF, 3NF, BCNF', type: 'leaf', x: 60, y: 60, info: '1NF: Atomic values; 2NF: No partial dependency; 3NF: No transitive dependency.' },
      { id: 'acid', label: 'ACID Properties', type: 'branch', x: 420, y: 120, info: 'Atomicity (all or none), Consistency (valid state), Isolation (independent transactions), Durability (permanent).' },
      { id: 'indexing', label: 'B+ Tree Indexing', type: 'branch', x: 260, y: 350, info: 'Why SQL queries run in 2ms on millions of rows instead of scanning everything sequentially.' }
    ],
    links: [
      { source: 'root', target: 'norm' },
      { source: 'norm', target: '1nf-3nf' },
      { source: 'root', target: 'acid' },
      { source: 'root', target: 'indexing' }
    ]
  },
  cn: {
    title: 'Computer Networks: OSI 7-Layer Flow',
    nodes: [
      { id: 'root', label: 'Network Flow', type: 'root', x: 260, y: 220, info: 'How an email or web request travels from your laptop keyboard across undersea cables to a server.' },
      { id: 'osi', label: 'OSI 7 Layers', type: 'branch', x: 130, y: 120, info: 'Physical -> Data Link -> Network -> Transport -> Session -> Presentation -> Application (Please Do Not Throw Sausage Pizza Away!).' },
      { id: 'tcp-udp', label: 'TCP vs UDP', type: 'branch', x: 420, y: 120, info: 'TCP: Reliable handshake (web pages, banking). UDP: Fast, no handshake (video streaming, gaming).' },
      { id: 'ip', label: 'IP Addressing & DNS', type: 'branch', x: 260, y: 350, info: 'DNS turns google.com into IP 142.250.x.x. Routers use routing tables to pass packets.' }
    ],
    links: [
      { source: 'root', target: 'osi' },
      { source: 'root', target: 'tcp-udp' },
      { source: 'root', target: 'ip' }
    ]
  }
};

let currentMindmapTopic = 'dsa';

function renderMindmap(topicKey = 'dsa') {
  const svg = document.getElementById('mindmap-svg');
  if (!svg) return;
  const data = MINDMAP_DATA[topicKey] || MINDMAP_DATA.dsa;

  // Clear svg
  svg.innerHTML = '';

  const width = svg.clientWidth || 580;
  const height = 480;

  // Render SVG links first
  const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  linkGroup.setAttribute('class', 'links-group');

  data.links.forEach(l => {
    const src = data.nodes.find(n => n.id === l.source);
    const tgt = data.nodes.find(n => n.id === l.target);
    if (!src || !tgt) return;

    // Scale coordinates to SVG bounding box
    const x1 = (src.x / 580) * width;
    const y1 = (src.y / 480) * height;
    const x2 = (tgt.x / 580) * width;
    const y2 = (tgt.y / 480) * height;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgba(139, 92, 246, 0.4)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '4,4');
    linkGroup.appendChild(line);
  });
  svg.appendChild(linkGroup);

  // Render SVG nodes
  const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodeGroup.setAttribute('class', 'nodes-group');

  data.nodes.forEach(node => {
    const nx = (node.x / 580) * width;
    const ny = (node.y / 480) * height;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'mindmap-node');
    g.style.cursor = 'pointer';

    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', nx);
    circle.setAttribute('cy', ny);
    circle.setAttribute('r', node.type === 'root' ? '28' : node.type === 'branch' ? '22' : '18');
    
    let fillColor = '#8b5cf6';
    if (node.type === 'branch') fillColor = '#06b6d4';
    if (node.type === 'leaf') fillColor = '#f59e0b';

    circle.setAttribute('fill', fillColor);
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('filter', 'drop-shadow(0 0 8px rgba(0,0,0,0.5))');

    // Label Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', nx);
    text.setAttribute('y', ny + (node.type === 'root' ? 42 : 36));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#f8fafc');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-family', 'Plus Jakarta Sans');
    text.setAttribute('font-weight', '600');
    text.textContent = node.label;

    g.appendChild(circle);
    g.appendChild(text);

    // Node click to display insight
    g.addEventListener('click', () => {
      selectMindmapNode(node);
      playChime(700, 'sine', 0.15);
    });

    nodeGroup.appendChild(g);
  });
  svg.appendChild(nodeGroup);
}

function selectMindmapNode(node) {
  const title = document.getElementById('insight-title');
  const body = document.getElementById('insight-body');
  const badge = document.getElementById('insight-badge');

  if (title) title.textContent = node.label;
  if (body) body.textContent = node.info;
  if (badge) {
    badge.textContent = node.type === 'root' ? 'Core Architecture' : node.type === 'branch' ? 'Key Concept Branch' : '80/20 Exam Focus';
    badge.style.background = node.type === 'root' ? 'var(--accent-purple)' : node.type === 'branch' ? 'var(--accent-cyan)' : 'var(--accent-gold)';
  }
}

// Community Notes Hub
const COMMUNITY_NOTES = [
  { id: 'cn-1', tag: 'DSA', title: 'Binary Trees vs BST in 4 Simple Diagrams', reads: '1.4k Reads', summary: 'Why slow learners struggle with recursion and how viewing trees as inverted pyramids simplifies everything.' },
  { id: 'cn-2', tag: 'OS', title: 'Deadlock 4 Conditions with Dining Philosophers', reads: '980 Reads', summary: 'Explains Mutual Exclusion and Circular Wait using 5 friends sharing forks at dinner.' },
  { id: 'cn-3', tag: 'DBMS', title: 'Normalization 1NF to BCNF (Zero Jargon)', reads: '2.1k Reads', summary: 'Step-by-step table decomposition without confusing mathematical formulas.' },
  { id: 'cn-4', tag: 'MATHS', title: 'Eigenvalues & Matrix Transformations Simplified', reads: '740 Reads', summary: 'Understanding matrix scaling geometrically before tackling linear equations.' }
];

function renderCommunityNotes(filter = '') {
  const list = document.getElementById('notes-library-list');
  if (!list) return;
  list.innerHTML = '';

  const filtered = COMMUNITY_NOTES.filter(n => 
    n.title.toLowerCase().includes(filter.toLowerCase()) || 
    n.tag.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-item-card';
    card.innerHTML = `
      <div class="note-top-row">
        <span class="note-tag">${note.tag}</span>
        <span class="note-reads"><i class="fa-regular fa-eye"></i> ${note.reads}</span>
      </div>
      <h4 class="note-title">${note.title}</h4>
      <p class="note-summary">${note.summary}</p>
      <div class="note-footer-row">
        <span>Hand-Drawn Mindmap</span>
        <span class="note-view-link">Open Mindmap <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    `;

    card.addEventListener('click', () => {
      showToast(`Loading visual mindmap for "${note.title}"!`);
      // auto switch to corresponding topic
      if (note.tag === 'DSA') {
        document.getElementById('mindmap-topic-select').value = 'dsa';
        renderMindmap('dsa');
      } else if (note.tag === 'OS') {
        document.getElementById('mindmap-topic-select').value = 'os';
        renderMindmap('os');
      } else if (note.tag === 'DBMS') {
        document.getElementById('mindmap-topic-select').value = 'dbms';
        renderMindmap('dbms');
      }
    });

    list.appendChild(card);
  });
}

// ==========================================================================
// 10. CHATGBP (AI DOUBT SOLVER FOR SLOW LEARNERS)
// ==========================================================================

const CHAT_KNOWLEDGE_BASE = {
  recursion: {
    eli5: `Imagine Russian Nesting Dolls (Matryoshka). 🪆\n\nTo find the tiny candy hidden in the smallest doll:\n1. You open Doll #1. Inside is a slightly smaller doll.\n2. You open Doll #2. Inside is another doll.\n3. Finally you open the smallest doll (This is your **Base Case**!). You grab the candy, then close each doll backwards on your way out.\n\nIn code: A function calls a copy of itself with a smaller input until it hits the base case! That's all recursion is.`,
    mindmap: `Recursion Breakdown:\n├── 1. Base Case (Emergency Brake: When to STOP)\n├── 2. Recursive Call (Do same work on smaller problem n-1)\n└── 3. Call Stack (Memory stores waiting tasks until base case returns)`,
    exam: `⚡ **Exam High-Yield Tips:**\n• Always write the **Base Condition** on line 1, or you get *StackOverflowError*.\n• Space complexity is O(N) due to recursion stack frames.\n• Common exam questions: Factorial, Fibonacci, Tower of Hanoi.`,
    cheer: `Hey, everyone struggles with recursion at first because our brains are used to linear loops (for, while)! It's completely normal to take a few days to visualize the stack. You're doing great! 🌟`
  },
  pointers: {
    eli5: `Think of a house and its GPS address. 🏠📍\n\n• An integer variable \`x = 10\` is the actual furniture inside the house.\n• A pointer variable \`*p\` is simply a slip of paper with the **House Address** written on it.\n\nWhen you pass by pointer, you don't clone the entire house; you just hand someone the paper so they can visit the same house directly!`,
    mindmap: `Pointers in C:\n├── \`&\` (Address-of operator) -> "Where does this live in RAM?"\n├── \`*\` (Dereference operator) -> "Go to this address and see what's inside!"\n└── \`NULL\` -> "Slip of paper points nowhere (Prevents crash)."`,
    exam: `⚡ **Exam Focus:**\n• Difference between \`*ptr\` (value) vs \`ptr\` (address).\n• Dangling pointer: Pointer pointing to deleted/freed memory.\n• Pointer arithmetic: \`ptr + 1\` jumps by \`sizeof(type)\` bytes!`,
    cheer: `Pointers used to scare every senior in college. Once you see it as just "memory address coordinates", you'll solve pointer questions faster than anyone! Keep your chin up! ⚡`
  },
  normalization: {
    eli5: `Imagine having one giant messy drawer with clothes, spoons, textbooks, and car keys. 🗄️\n\nIf you want to find a spoon, you have to dig through everything, and if a spoon breaks, it ruins your shirts!\n\nNormalization is simply buying 3 neat small organizer boxes: one for Clothes, one for Utensils, and one for Books. Clean, zero duplicates, and impossible to mess up!`,
    mindmap: `DBMS Normal Forms:\n├── 1NF: Atomic values only (No lists in 1 cell)\n├── 2NF: 1NF + No partial dependencies (Full key dependence)\n├── 3NF: 2NF + No transitive dependencies (Non-key depends on non-key)\n└── BCNF: Strictest form of 3NF`,
    exam: `⚡ **Exam Score Secret:**\n• Question: "Decompose this table into 3NF".\n• Step 1: Find candidate keys.\n• Step 2: Test each Functional Dependency (X -> Y). If X is not a super key and Y is not prime, decompose!`,
    cheer: `Database design is like organizing a room. Slow, methodical steps make it so clean you'll never forget it. You've got this!`
  },
  demotivated: {
    eli5: `Think of learning like a bamboo tree. 🎋\nFor the first 4 years, a Chinese bamboo tree grows almost zero centimeters above ground. It's building massive, deep underground roots.\nThen in year 5, it shoots up 80 feet in just six weeks!\n\nYou are building your root system. Fast rote learners will hit walls when real-world problems appear. Your deep comprehension will carry you much farther!`,
    mindmap: `Comparison Antidote:\n├── Past You vs Current You (The ONLY valid metric)\n├── Deep Intuition > Fast Memorization\n└── Hunting Will community has your back every day!`,
    exam: `⚡ Remember: In exams, handwriting speed or finishing first doesn't give bonus marks. Accurate, well-explained answers get full marks. Stay calm and answer questions you know best first!`,
    cheer: `You are worthy, intelligent, and capable. Never let someone else's speed make you doubt your direction. Take a 5-minute breather, drink water, and conquer the next small task! 💖`
  }
};

function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chat-user-input');
  const query = input.value.trim();
  if (!query) return;

  const modeSelect = document.getElementById('chat-mode-select');
  const mode = modeSelect ? modeSelect.value : 'eli5';

  // Append user bubble
  appendChatBubble('user', query);
  input.value = '';

  // Process Bot Response
  const container = document.getElementById('chat-messages-container');
  const loadingBubble = document.createElement('div');
  loadingBubble.className = 'chat-bubble bot-bubble';
  loadingBubble.innerHTML = `
    <div class="bubble-sender"><i class="fa-solid fa-robot"></i> ChatGBP</div>
    <div class="bubble-content"><i class="fa-solid fa-spinner fa-spin"></i> Formulating intuitive visual breakdown...</div>
  `;
  container.appendChild(loadingBubble);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    loadingBubble.remove();
    const replyText = generateBotReply(query, mode);
    appendChatBubble('bot', replyText);
    addXP(20);
    playChime(660, 'sine', 0.2);
  }, 700);
}

function generateBotReply(query, mode) {
  const lower = query.toLowerCase();

  let topic = null;
  if (lower.includes('recur')) topic = 'recursion';
  else if (lower.includes('point') || lower.includes('memory') || lower.includes('address')) topic = 'pointers';
  else if (lower.includes('norm') || lower.includes('dbms') || lower.includes('acid') || lower.includes('sql')) topic = 'normalization';
  else if (lower.includes('demotiv') || lower.includes('topper') || lower.includes('slow') || lower.includes('depress') || lower.includes('friend') || lower.includes('fail')) topic = 'demotivated';

  if (topic && CHAT_KNOWLEDGE_BASE[topic]) {
    const entry = CHAT_KNOWLEDGE_BASE[topic];
    let content = entry[mode] || entry.eli5;
    return content.replace(/\n/g, '<br>');
  }

  // Generic intuitive response generator
  const modeHeaders = {
    eli5: '🐣 <strong>Here is the gentle, real-world metaphor:</strong><br><br>',
    mindmap: '🧠 <strong>Visual Concept Breakdown:</strong><br><br>',
    exam: '⚡ <strong>Direct 80/20 Semester Exam Hacks:</strong><br><br>',
    cheer: '💖 <strong>Take a deep breath, Hunter:</strong><br><br>'
  };

  return `${modeHeaders[mode] || ''}
  When approaching <strong>"${query}"</strong>, remember the slow-learner superpower: <em>Never memorize definitions verbatim.</em>
  <br><br>
  1. <strong>Visual Anchor:</strong> Picture the concept as physical objects (e.g. containers, conveyor belts, or flowcharts).
  <br>
  2. <strong>Rule of One:</strong> Focus on understanding only the first step before looking at the complete algorithm.
  <br>
  3. <strong>Exam Secret:</strong> Professors grade on clarity of diagrams and correct keywords. Draw a neat diagram first!
  <br><br>
  Would you like me to generate a step-by-step mindmap breakdown for this specific question?`;
}

function appendChatBubble(sender, content) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}`;

  const senderName = sender === 'user' ? 'You (Hunter)' : 'ChatGBP';
  const icon = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

  bubble.innerHTML = `
    <div class="bubble-sender">${icon} ${senderName}</div>
    <div class="bubble-content">${content}</div>
    <div class="bubble-time">Just now</div>
  `;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// ==========================================================================
// 11. EXAM SECRET VAULT
// ==========================================================================

const VAULT_TIPS = [
  {
    id: 'tip-1',
    cost: 50,
    category: 'High-Yield 80/20',
    title: 'Semester Exam 80/20 Question Predictor',
    teaser: 'How to score 75%+ by studying only 20% of repetitive recurring syllabus questions.',
    content: `
      <h4>The 80/20 Law of University Semester Exams</h4>
      <p>University professors don't have time to write 100% brand-new papers every semester. <strong>70% to 80% of marks come from the exact same 12 recurring questions</strong> across previous 5-year question papers (PYQs)!</p>
      <br>
      <strong>Exact Execution Strategy for Slow Learners:</strong>
      <ul>
        <li><strong>Step 1:</strong> Collect previous 5 years question papers.</li>
        <li><strong>Step 2:</strong> Group questions by topic. You will notice 3 questions repeat almost every alternative year.</li>
        <li><strong>Step 3:</strong> Prepare visual diagrams for those 3 questions first. That guarantees passing marks with zero stress!</li>
        <li><strong>Step 4:</strong> Never read a 600-page book from page 1 to 600. Read index -> map to PYQs -> study only those nodes.</li>
      </ul>
    `
  },
  {
    id: 'tip-2',
    cost: 100,
    category: 'Paper Presentation',
    title: 'Professor Psychology: Maximum Marks Formula',
    teaser: 'Why neat diagrams and bullet points beat 3-page handwritten essays in university evaluations.',
    content: `
      <h4>How College Evaluators Actually Check Answer Sheets</h4>
      <p>Evaluators check 60 to 100 answer scripts per day. When they see a dense block of 40 lines of handwritten text with no headings, their eyes glaze over.</p>
      <br>
      <strong>The 4-Step Presentation Template:</strong>
      <ul>
        <li><strong>1. Definition in 2 lines:</strong> Bold keywords.</li>
        <li><strong>2. Boxed Diagram / Mindmap:</strong> Draw a neat, boxed schematic right in the center. Evaluators give 50% of the question marks right here without reading the text!</li>
        <li><strong>3. 4-5 Numbered Points:</strong> Short, crisp bullet points.</li>
        <li><strong>4. Real-World Example:</strong> Shows you actually understand instead of rote copying.</li>
      </ul>
    `
  },
  {
    id: 'tip-3',
    cost: 150,
    category: 'Panic Protocol',
    title: '1-Night Before Exam Survival Protocol',
    teaser: 'Got an exam tomorrow morning and feeling completely lost? Follow this exact triage procedure.',
    content: `
      <h4>Last-Night Emergency Triage</h4>
      <p>Do NOT try to pull an all-nighter trying to learn 5 units from scratch. Sleep deprivation ruins working memory, causing brain freezes in the exam hall.</p>
      <br>
      <strong>Action Plan:</strong>
      <ul>
        <li><strong>8:00 PM - 10:00 PM:</strong> Pick Unit 1 & Unit 2 only. Review their basic definitions and block diagrams.</li>
        <li><strong>10:00 PM - 12:00 AM:</strong> Solve the 2 most repeated numericals or derivations with open notes.</li>
        <li><strong>12:00 AM:</strong> SLEEP for at least 6 hours. A rested brain can deduce answers; an exhausted brain forgets even basic formulas.</li>
        <li><strong>Morning:</strong> Review your 1-page mindmap summary over breakfast.</li>
      </ul>
    `
  },
  {
    id: 'tip-4',
    cost: 200,
    category: 'Viva & Lab Hacks',
    title: 'Lab External Viva Ace Framework',
    teaser: 'How to handle scary external examiners with calm confidence even when you don’t know code.',
    content: `
      <h4>Conquering External Lab Examiners</h4>
      <p>External examiners test your honesty and core logic, not whether you memorized syntax errors.</p>
      <br>
      <strong>Key Hacks:</strong>
      <ul>
        <li>If you don't know the answer, never guess randomly. Say: <em>"Sir, I am not fully certain about the exact syntax, but conceptually it works by..."</em> and explain the intuition!</li>
        <li>Always know the **Inputs, Outputs, and Purpose** of your lab experiment.</li>
        <li>Keep your record clean and signed. First impressions dictate viva scores.</li>
      </ul>
    `
  }
];

function renderVaultTips() {
  const grid = document.getElementById('tips-grid');
  if (!grid) return;
  grid.innerHTML = '';

  VAULT_TIPS.forEach(tip => {
    const isUnlocked = appState.unlockedTips.includes(tip.id);

    const card = document.createElement('div');
    card.className = 'tip-card';
    card.innerHTML = `
      <div>
        <div class="tip-header">
          <span class="tip-category-tag tag-purple">${tip.category}</span>
          <span class="tip-cost-pill">
            ${isUnlocked ? '<i class="fa-solid fa-lock-open text-emerald"></i> Unlocked' : `<i class="fa-solid fa-coins"></i> ${tip.cost} Coins`}
          </span>
        </div>
        <h3 class="tip-title">${tip.title}</h3>
        <p class="tip-teaser">${tip.teaser}</p>
      </div>

      <div>
        <button class="${isUnlocked ? 'btn-secondary' : 'btn-accent'} btn-sm" style="width: 100%;">
          ${isUnlocked ? '<i class="fa-solid fa-book-open"></i> Read Tip' : `<i class="fa-solid fa-key"></i> Unlock (${tip.cost} Coins)`}
        </button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      if (isUnlocked) {
        openVaultModal(tip);
      } else {
        if (appState.coins >= tip.cost) {
          appState.coins -= tip.cost;
          appState.unlockedTips.push(tip.id);
          playCoinSound();
          triggerConfettiBurst();
          showToast(`Unlocked "${tip.title}"! 🎉`, 'coin');
          saveState();
          updateHeaderAndStats();
          openVaultModal(tip);
        } else {
          showToast(`⚠️ Need ${tip.cost - appState.coins} more Will Coins! Complete attendance or quests to earn coins.`);
        }
      }
    });

    grid.appendChild(card);
  });
}

function openVaultModal(tip) {
  const modal = document.getElementById('vault-modal');
  const title = document.getElementById('vault-modal-title');
  const content = document.getElementById('vault-modal-content');

  if (title) title.textContent = tip.title;
  if (content) content.innerHTML = tip.content;
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
}

// ==========================================================================
// 12. INITIALIZATION & EVENT LISTENERS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Init Ambient Canvas
  initAmbientCanvas();

  // Navigation Tabs Switching
  const navButtons = document.querySelectorAll('.nav-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      
      navButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      playChime(440, 'triangle', 0.1);

      // Re-render mindmap if switching to mindmaps
      if (targetTabId === 'tab-mindmaps') {
        setTimeout(() => renderMindmap(currentMindmapTopic), 50);
      }
    });
  });

  // Anti-Topper POV toggle
  const antiTopperToggle = document.getElementById('anti-topper-toggle');
  const povBanner = document.getElementById('pov-banner');
  if (antiTopperToggle) {
    antiTopperToggle.checked = appState.antiTopperMode;
    antiTopperToggle.addEventListener('change', (e) => {
      appState.antiTopperMode = e.target.checked;
      saveState();
      if (appState.antiTopperMode) {
        povBanner.style.display = 'flex';
        showToast('🛡️ Anti-Topper Mode Activated: Comparison turned off! Focus on self-growth.');
      } else {
        povBanner.style.display = 'none';
        showToast('Standard View active.');
      }
    });
  }

  const closePovBannerBtn = document.getElementById('close-pov-banner');
  if (closePovBannerBtn) {
    closePovBannerBtn.addEventListener('click', () => {
      povBanner.style.display = 'none';
    });
  }

  // Audio Controls
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener('click', toggleLoFiAmbience);
  }

  const audioVolInput = document.getElementById('audio-volume');
  if (audioVolInput) {
    audioVolInput.addEventListener('input', (e) => {
      if (ambientGainNode && audioCtx) {
        const val = (e.target.value / 100) * 0.15;
        ambientGainNode.gain.setValueAtTime(val, audioCtx.currentTime);
      }
    });
  }

  // Motivational Quote Ticker Shuffle
  let quoteIndex = 0;
  const quoteElem = document.getElementById('current-quote');
  const nextQuoteBtn = document.getElementById('next-quote-btn');

  function cycleQuote() {
    quoteIndex = (quoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
    if (quoteElem) {
      quoteElem.style.opacity = '0';
      setTimeout(() => {
        quoteElem.textContent = `"${MOTIVATIONAL_QUOTES[quoteIndex]}"`;
        quoteElem.style.opacity = '1';
      }, 200);
    }
  }

  if (nextQuoteBtn) {
    nextQuoteBtn.addEventListener('click', () => {
      cycleQuote();
      playChime(500, 'sine', 0.1);
    });
  }
  // Auto cycle quote every 12 seconds
  setInterval(cycleQuote, 12000);

  // Character Switcher Modal
  const openAvatarBtn = document.getElementById('open-avatar-modal-btn');
  const changeCharBtn = document.getElementById('change-character-btn');
  const charModal = document.getElementById('character-modal');
  const closeCharModalBtn = document.getElementById('close-character-modal');
  const cancelCharSelectBtn = document.getElementById('cancel-char-select-btn');
  const confirmCharSelectBtn = document.getElementById('confirm-char-select-btn');

  let selectedCharCandidate = appState.character;

  function openCharModal() {
    selectedCharCandidate = appState.character;
    const cards = document.querySelectorAll('.char-option-card');
    cards.forEach(c => {
      const charKey = c.getAttribute('data-char');
      c.classList.toggle('active', charKey === selectedCharCandidate);
    });
    charModal.classList.add('open');
    charModal.setAttribute('aria-hidden', 'false');
  }

  function closeCharModal() {
    charModal.classList.remove('open');
    charModal.setAttribute('aria-hidden', 'true');
  }

  if (openAvatarBtn) openAvatarBtn.addEventListener('click', openCharModal);
  if (changeCharBtn) changeCharBtn.addEventListener('click', openCharModal);
  if (closeCharModalBtn) closeCharModalBtn.addEventListener('click', closeCharModal);
  if (cancelCharSelectBtn) cancelCharSelectBtn.addEventListener('click', closeCharModal);

  document.querySelectorAll('.char-option-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedCharCandidate = card.getAttribute('data-char');
      document.querySelectorAll('.char-option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      playChime(600, 'triangle', 0.15);
    });
  });

  if (confirmCharSelectBtn) {
    confirmCharSelectBtn.addEventListener('click', () => {
      appState.character = selectedCharCandidate;
      saveState();
      updateHeaderAndStats();
      closeCharModal();
      triggerConfettiBurst();
      showToast(`Selected ${CHARACTERS[appState.character].name} as your companion! ✨`, 'success');
    });
  }

  // Study Hour Logging (Character XP & Coins)
  const claimStudyXpBtn = document.getElementById('claim-study-xp-btn');
  if (claimStudyXpBtn) {
    claimStudyXpBtn.addEventListener('click', () => {
      addXP(60);
      addCoins(25);
    });
  }

  // Gear Evolution Trigger
  const triggerEvolutionBtn = document.getElementById('trigger-evolution-btn');
  if (triggerEvolutionBtn) {
    triggerEvolutionBtn.addEventListener('click', () => {
      if (appState.coins >= 100) {
        appState.coins -= 100;
        appState.charTier = Math.min(4, appState.charTier + 1);
        playLevelUpFanfare();
        triggerConfettiBurst();
        showToast(`⚡ Character Evolved to Tier ${appState.charTier} Gear!`, 'success');
        saveState();
        updateHeaderAndStats();
      } else {
        showToast('⚠️ You need at least 100 Will Coins to evolve gear! Earn more by logging attendance & quizzes.');
      }
    });
  }

  // Complete Monthly Cert
  const completeMonthlyCertBtn = document.getElementById('complete-monthly-cert-btn');
  if (completeMonthlyCertBtn) {
    completeMonthlyCertBtn.addEventListener('click', () => {
      if (!appState.monthlyCert.completed) {
        appState.monthlyCert.completed = true;
        appState.monthlyCert.progress = 100;
        appState.yearlyCerts.completed = Math.min(appState.yearlyCerts.target, appState.yearlyCerts.completed + 1);
        addCoins(200);
        addXP(250);
        triggerConfettiBurst();
        showToast('🏆 Monthly Course Certificate Completed! +200 Coins & +250 XP!', 'success');
        saveState();
        updateHeaderAndStats();
      }
    });
  }

  // Add Goal / Quest button
  const addGoalBtn = document.getElementById('add-custom-goal-btn');
  if (addGoalBtn) {
    addGoalBtn.addEventListener('click', () => {
      const title = prompt('Enter your private milestone goal (e.g., "Build 1 mini project this weekend"):');
      if (title && title.trim()) {
        appState.quests.push({
          id: 'q_' + Date.now(),
          title: title.trim(),
          xp: 50,
          coins: 25,
          done: false
        });
        saveState();
        renderQuests();
        showToast('Private goal added! Check it off when you finish.');
      }
    });
  }

  // Update Grades button
  const editGradesBtn = document.getElementById('edit-grades-btn');
  if (editGradesBtn) {
    editGradesBtn.addEventListener('click', () => {
      const newSgpa = prompt('Enter your latest Semester SGPA (e.g., 7.9):', '7.9');
      if (newSgpa && !isNaN(parseFloat(newSgpa))) {
        const val = parseFloat(newSgpa);
        appState.semesters[3].sgpa = val;
        // Recalculate CGPA
        const completed = appState.semesters.filter(s => s.completed);
        const sum = completed.reduce((a, b) => a + b.sgpa, 0);
        appState.cgpa = sum / completed.length;
        saveState();
        updateHeaderAndStats();
        showToast('Updated semester grades! Great progress! 📈', 'success');
      }
    });
  }

  // Mindmap Topic Selector
  const mindmapTopicSelect = document.getElementById('mindmap-topic-select');
  if (mindmapTopicSelect) {
    mindmapTopicSelect.addEventListener('change', (e) => {
      currentMindmapTopic = e.target.value;
      renderMindmap(currentMindmapTopic);
    });
  }

  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      renderMindmap(currentMindmapTopic);
      showToast('Mindmap view centered.');
    });
  }

  // Notes Search
  const searchNotesInput = document.getElementById('search-notes-input');
  if (searchNotesInput) {
    searchNotesInput.addEventListener('input', (e) => {
      renderCommunityNotes(e.target.value);
    });
  }

  // Upload Mindmap Note button
  const uploadNoteBtn = document.getElementById('upload-note-btn');
  if (uploadNoteBtn) {
    uploadNoteBtn.addEventListener('click', () => {
      const topic = prompt('Enter the concept topic you drew a mindmap for (e.g. "Sorting Algorithms"):');
      if (topic && topic.trim()) {
        COMMUNITY_NOTES.unshift({
          id: 'cn_' + Date.now(),
          tag: 'STUDENT',
          title: topic.trim() + ' Simplified',
          reads: '1 Read (Just added)',
          summary: 'User shared visual diagram for quick peer review.'
        });
        addCoins(30);
        showToast(`Shared "${topic}" with the community! +30 Coins earned! 🪙`, 'coin');
        renderCommunityNotes();
      }
    });
  }

  // Attendance Add Subject Modal
  const addSubjectBtn = document.getElementById('add-subject-btn');
  const subjectModal = document.getElementById('subject-modal');
  const closeSubjectModalBtn = document.getElementById('close-subject-modal');
  const cancelSubjectBtn = document.getElementById('cancel-subject-btn');
  const subjectForm = document.getElementById('subject-form');

  if (addSubjectBtn) {
    addSubjectBtn.addEventListener('click', () => {
      subjectModal.classList.add('open');
      subjectModal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeSubModal() {
    subjectModal.classList.remove('open');
    subjectModal.setAttribute('aria-hidden', 'true');
  }

  if (closeSubjectModalBtn) closeSubjectModalBtn.addEventListener('click', closeSubModal);
  if (cancelSubjectBtn) cancelSubjectBtn.addEventListener('click', closeSubModal);

  if (subjectForm) {
    subjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('subject-name-input').value.trim();
      const attended = parseInt(document.getElementById('subject-attended-input').value, 10) || 0;
      const total = parseInt(document.getElementById('subject-total-input').value, 10) || 1;

      if (name) {
        appState.subjects.push({
          id: 's_' + Date.now(),
          name,
          attended,
          total
        });
        saveState();
        updateHeaderAndStats();
        closeSubModal();
        showToast(`Subject "${name}" added to tracker!`);
        subjectForm.reset();
      }
    });
  }

  // Calendar Navigation
  const calPrevBtn = document.getElementById('cal-prev-btn');
  const calNextBtn = document.getElementById('cal-next-btn');

  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', () => {
      currentCalendarMonth--;
      if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
      }
      renderCalendar();
    });
  }

  if (calNextBtn) {
    calNextBtn.addEventListener('click', () => {
      currentCalendarMonth++;
      if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
      }
      renderCalendar();
    });
  }

  // Add Reminder Modal
  const addReminderBtn = document.getElementById('add-reminder-btn');
  const reminderModal = document.getElementById('reminder-modal');
  const closeReminderModalBtn = document.getElementById('close-reminder-modal');
  const cancelReminderBtn = document.getElementById('cancel-reminder-btn');
  const reminderForm = document.getElementById('reminder-form');

  if (addReminderBtn) {
    addReminderBtn.addEventListener('click', () => {
      const dateInput = document.getElementById('reminder-date-input');
      if (dateInput) dateInput.value = selectedDateStr;
      reminderModal.classList.add('open');
      reminderModal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeRemModal() {
    reminderModal.classList.remove('open');
    reminderModal.setAttribute('aria-hidden', 'true');
  }

  if (closeReminderModalBtn) closeReminderModalBtn.addEventListener('click', closeRemModal);
  if (cancelReminderBtn) cancelReminderBtn.addEventListener('click', closeRemModal);

  if (reminderForm) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('reminder-title-input').value.trim();
      const date = document.getElementById('reminder-date-input').value;
      const category = document.getElementById('reminder-category-input').value;

      if (title && date) {
        appState.reminders.push({
          id: 'r_' + Date.now(),
          title,
          date,
          category
        });
        saveState();
        renderCalendar();
        renderReminders();
        closeRemModal();
        showToast('Reminder saved to calendar! 📅');
        reminderForm.reset();
      }
    });
  }

  // ChatGBP Form and Quick Prompts
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }

  const promptChips = document.querySelectorAll('.prompt-chip');
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      const input = document.getElementById('chat-user-input');
      if (input) {
        input.value = query;
        handleChatSubmit();
      }
    });
  });

  // Vault Modal close
  const closeVaultModalBtn = document.getElementById('close-vault-modal');
  const doneVaultModalBtn = document.getElementById('done-vault-modal-btn');
  const vaultModal = document.getElementById('vault-modal');

  function closeVModal() {
    if (vaultModal) {
      vaultModal.classList.remove('open');
      vaultModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (closeVaultModalBtn) closeVaultModalBtn.addEventListener('click', closeVModal);
  if (doneVaultModalBtn) doneVaultModalBtn.addEventListener('click', closeVModal);

  // Earn More Coins Shortcut
  const earnMoreCoinsBtn = document.getElementById('earn-more-coins-btn');
  if (earnMoreCoinsBtn) {
    earnMoreCoinsBtn.addEventListener('click', () => {
      // Switch to character / quests tab
      document.querySelector('[data-tab="tab-character"]').click();
      showToast('Complete daily quests or log study hours to earn Will Coins!');
    });
  }

  // Initial Render Call
  updateHeaderAndStats();
  renderCalendar();
  renderCommunityNotes();
  renderMindmap('dsa');
});
