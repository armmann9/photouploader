# Utsav Hub - Society Festive Portal & AI Photo Hub (उत्सव मंडप)

An authentic Indian festival community portal with 3D animated celebration aesthetics, AI face-matching event photo finder, and 300+ photo bulk management.

---

## 🚀 Quick Start Guide (How to Run on Your Computer)

### Step 1: Install Node.js
Ensure you have Node.js (version 18 or higher) installed on your computer. Download from https://nodejs.org if needed.

### Step 2: Open Terminal / Command Prompt
Extract this ZIP folder and open your terminal or command prompt inside the extracted folder:
```bash
cd utsav-hub-project
```

### Step 3: Install Dependencies
Run the following command to install all packages:
```bash
npm install
```

### Step 4: Start the Local Development Server
```bash
npm run dev
```
Now open your browser and visit:
👉 **http://localhost:3000** (or the port shown in your terminal)

---

## 🛠️ Tech Stack Included
- **React 19** + **TypeScript**
- **Vite 6** (lightning fast build and preview)
- **Tailwind CSS v4** (rich festive gradients & custom animations)
- **Lucide React** (icons for camera, audio, downloads, sharing)
- **Canvas Confetti** (custom marigold & rose flower petal shower)
- **Web Audio API** (procedural Tanpura drone & brass temple bell chimes - no external audio files needed!)
- **JSZip** (in-browser code exporter)

---

## 📁 Project Structure
```
├── index.html                 # Main HTML entry with Indian display typography
├── package.json               # All scripts and dependencies
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── src/
│   ├── main.tsx               # App bootstrap
│   ├── App.tsx                # Master festive layout with 3D stage
│   ├── index.css              # Global styles, 3D perspective, flame animations
│   ├── types.ts               # Data models (Festivals, Photos, Face Scans)
│   ├── components/
│   │   ├── ToranGarland.tsx       # Physics-swaying marigold & rose flower toran
│   │   ├── TemplePillars.tsx      # 3D parallax carved Indian temple columns with diyas
│   │   ├── PetalCanvas.tsx        # Multi-depth 3D flower petal particle engine
│   │   ├── GlowingMandala.tsx     # Rotating sacred geometric mandala with sun rays
│   │   ├── TiltCard.tsx           # 3D perspective tilt cards with specular lighting
│   │   ├── FaceMatchFinder.tsx    # AI face scanner, webcam capture, WhatsApp sharing
│   │   ├── BulkPhotoUploader.tsx  # 300+ photo bulk compressor (WebP) & cost saver
│   │   ├── SocietyTechGuide.tsx   # Domain, Cloud storage, and RWA proposal guide
│   │   └── EventGalleryModal.tsx  # High-res lightbox and festival photo album viewer
│   ├── data/
│   │   └── festivalEvents.ts      # Curated festival events and photo archives
│   └── utils/
│       ├── audio.ts               # Web Audio Tanpura & Temple Bell chimes
│       ├── confetti.ts            # Marigold & Rose petal burst
│       └── downloadZip.ts         # In-browser ZIP packaging engine
└── README.md
```

---

## 🌐 Deploying to Free Hosting (Vercel / Cloud Run / Netlify)

1. **Vercel**:
   - Push your project to GitHub.
   - Go to [Vercel.com](https://vercel.com) and click **"New Project"**.
   - Select your repository and click **"Deploy"**.
   - Your site is live on HTTPS for ₹0!

2. **Custom Society Domain (e.g. `www.gokuldham.in`)**:
   - Buy a `.in` domain on GoDaddy / Namecheap for ~₹499/year.
   - Add the domain in your Vercel/Cloud Run dashboard by pointing DNS to CNAME.

Enjoy celebrating and preserving your colony's festival memories! 🎉
