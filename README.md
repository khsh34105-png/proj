# ✨ A World Made For You

> A magical, interactive surprise website — cinematic, emotional, playful, and full of hidden surprises.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- [VS Code](https://code.visualstudio.com/) (recommended)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. ✨

---

## 🛠 Customize It (Make It Yours)

### 📝 Change names, messages, memories

All the personal content lives in these files — just edit the text:

| File | What to change |
|------|---------------|
| `src/components/HeroSection.jsx` | Opening messages, taglines |
| `src/components/TimelineSection.jsx` | Memory titles, dates, stories |
| `src/components/EmotionalSection.jsx` | Reasons, "what reminds me of you", "never said" messages |
| `src/components/FakeChatSection.jsx` | Chat conversations |
| `src/components/GamesSection.jsx` | Compliment messages |
| `src/components/QuizGame.jsx` | Quiz questions + answers |
| `src/components/GrandFinale.jsx` | Final messages |

### 🎨 Change colors/theme

In `src/index.css`, edit the CSS variables at the top:

```css
:root {
  --rose: #ff6b9d;     /* pink accent */
  --violet: #c77dff;   /* purple accent */
  --sky: #72efdd;      /* teal accent */
  --amber: #ffd60a;    /* gold accent */
}
```

### 🔒 Add a password (optional)

In `src/App.jsx`, before the loading screen, you can add a simple password gate:

```jsx
const [unlocked, setUnlocked] = useState(false);
// Add a password input form before <LoadingScreen>
```

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. You can preview it with:

```bash
npm run preview
```

---

## 🚀 Deploy to GitHub Pages

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "✨ initial magic world"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will auto-deploy on every push to `main`

### Step 3: Done! 🎉

Your site will be live at:
`https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## 🗺 Project Structure

```
magic-world/
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx      # Cinematic intro + enter button
│   │   ├── HeroSection.jsx        # Opening hero with typewriter
│   │   ├── TimelineSection.jsx    # Interactive memory timeline
│   │   ├── GamesSection.jsx       # Mini games hub
│   │   ├── MemoryGame.jsx         # Card matching game
│   │   ├── QuizGame.jsx           # "How well do you know me?"
│   │   ├── YesNoGame.jsx          # Escaping NO button 😂
│   │   ├── EmotionalSection.jsx   # Reasons + things I never said
│   │   ├── FakeChatSection.jsx    # Animated chat replay
│   │   ├── GrandFinale.jsx        # Confetti ending
│   │   ├── MusicPlayer.jsx        # Floating music player
│   │   ├── ParticleCanvas.jsx     # Floating particles + emojis
│   │   ├── CustomCursor.jsx       # Custom cursor effect
│   │   ├── NavigationDots.jsx     # Side chapter navigation
│   │   └── EasterEggs.jsx         # Konami code + hidden secrets
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/workflows/deploy.yml   # Auto GitHub Pages deploy
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🥚 Easter Eggs (Hidden Secrets)

Tell them to discover these on their own... or don't 😏

- **Konami Code**: ↑↑↓↓←→←→BA on keyboard
- **Corner star**: Bottom-left corner of the page
- **Double-click 7 times** anywhere
- **Hover over very faint elements** around the hero section
- **Click the ⭐** in the top-right corner of the hero

---

## 💜 Tech Stack

- **React 18** + **Vite**
- **Framer Motion** — animations
- **Tailwind CSS** — styling
- **react-type-animation** — typewriter effect
- **react-confetti** — finale celebration

---

*Made with too many feelings and not enough sleep. 💫*
