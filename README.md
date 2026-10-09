# ⚡ Hunting Will — Smart Education Platform

> **"Hunt Your Potential, At Your Own Pace."**  
> A gamified, private, and empowering smart learning companion designed specifically for **slow learners, neurodivergent students, and paced learners** in college.

---

## 🌟 Why "Hunting Will"? (The Problem & Solution)

In traditional college environments, **toxic topper comparison** harms slow learners. Fast rote memorizers make deliberate, conceptual learners feel inadequate.

**Hunting Will flips the script:**
1. **Anti-Topper Paradigm:** Replaces toxic peer rankings with **"You vs. Yesterday"** metrics. A +0.4 SGPA improvement is celebrated like a boss battle victory.
2. **Visual Mindmaps over 50-Page Textbooks:** While others get exhausted transcribing 50 pages of handwritten notes, slow learners grasp concepts in 1 glance with interactive SVG mindmaps.
3. **Animated Gen-Z Companion & Evolution:** Pick an avatar (Nova, Aria, Blitz, Kairo) that levels up and unlocks glowing aura gear as you tackle harder college years.
4. **Will Coins & Exam Secret Vault:** Earn coins through attendance and micro-tasks, then redeem them for high-yield 80/20 semester exam hacks, formula sheets, and professor evaluation templates.
5. **Smart Attendance & Safe-Bunk Calculator:** Calculates safe bunks or required classes in real-time so students stay comfortably above the mandatory 75% university rule without anxiety.
6. **ChatGBP (In-Website AI Doubt Solver):** A private, gentle AI tutor with zero condescension. Includes **ELI5 (Explain Like I'm 5)**, **Mindmap Breakdown**, **80/20 Exam Focus**, and **Confidence Booster** modes.
7. **Built-in Lo-Fi Ambience & Motivational Quotes:** Web Audio synthesized 432Hz focus drone and rain beats with rotating inspiring quotes tailored for paced learners.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **🎮 Avatar & Evolution Lab** | Choose between **Nova** (Cyber Runner), **Aria** (Zen Alchemist), **Blitz** (Pixel Knight), or **Kairo** (Cosmic Sage). As your college difficulty progresses from Year 1 to Year 4, your character visually evolves into higher tiers. |
| **🏆 Monthly & Yearly Milestones** | Healthy pacing goals (e.g. complete 1 certificate this month, 4 by year-end). Earn XP and Will Coins on completion. |
| **📈 CGPA & Year Difficulty Map** | Visualizes SGPA jumps and projects what grade you need in remaining semesters to achieve your target CGPA. Includes an Easy-to-Hard 4-Year College Survival Roadmap. |
| **🗺️ Interactive Mindmaps & Notes** | Interactive node graphs for Data Structures, Operating Systems, DBMS, and Networks. Click any node to reveal instant intuitive breakdowns. |
| **📅 Attendance & Safe-Bunk Engine** | Live attendance logger for each subject. Tells you exactly: *"You can safely bunk 2 classes"* or *"Must attend next 3 classes to hit 75%"*. |
| **🗓️ Calendar & Reminders** | Schedule exams, assignments, revision sessions, and certificate targets with visual calendar dots and category badges. |
| **🤖 ChatGBP AI Tutor** | Ask any doubt without fear of judgment. Pre-loaded with answers for Recursion, Pointers, DBMS Normalization, and motivation. |
| **🪙 Will Coins & Secret Vault** | Redeem earned coins for *80/20 Question Predictors*, *Professor Presentation Templates*, and *1-Night Survival Protocols*. |

---

## 💻 How to Run

### Option 1: Direct Launch (Recommended)
Double-click `launch_hunting_will.bat` or simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave).

### Option 2: Local Web Server
You can also run any local server in this directory:
```bash
# If using Python (when installed):
python -m http.server 8000

# Or if using Node:
npx serve .
```
Then navigate to `http://localhost:8000`.

---

## 📁 Project Structure

```
HNX-092/
├── index.html            # Main semantic HTML structure & UI views
├── style.css             # Glassmorphism & Gen-Z cyberpunk dark styling
├── app.js                # Core state, Web Audio synthesizer, mindmaps & chatbot
├── launch_hunting_will.bat # Quick launcher script
├── README.md             # Project documentation
└── assets/               # Generated high-resolution avatar artworks
    ├── nova.jpg          # Cyber Runner avatar
    ├── aria.jpg          # Zen Alchemist avatar
    ├── blitz.jpg         # Pixel Knight avatar
    └── kairo.jpg         # Cosmic Sage avatar
```

---

## 🛡️ Privacy & State Persistence
All progress, coins, attendance logs, notes, and character evolutions are stored locally in the browser's `localStorage`. No data leaves the user's machine.
