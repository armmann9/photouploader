import { FestivalEvent, SocietyGuideTopic } from '../types/utsav';

export const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: 'diwali-2024',
    title: 'Grand Diwali Deepotsav & Mela',
    hindiTitle: 'भव्य दीपोत्सव एवं दिवाली मेला',
    date: '1 Nov 2024',
    year: 2024,
    location: 'Central Clubhouse Lawn & Temple Courtyard',
    attendeesCount: 480,
    photoCount: 312,
    coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
    colorAccent: '#f59e0b',
    description: 'A magical evening with 2,100 earthen diyas lighting up the colony, grand rangoli competition, kids Ramlila play, food stalls, and eco-friendly sky lanterns.',
    highlights: ['2,100 Earthen Diyas Lit', 'Rangoli Championship (42 Teams)', 'Laxmi Puja with Vedic Chants', 'Society Sweet Distribution'],
    photos: [
      {
        id: 'diwali-p1',
        url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
        caption: 'Lighting the grand Maha-Diya at the society temple entrance',
        takenAt: '7:15 PM',
        eventId: 'diwali-2024',
        eventTitle: 'Grand Diwali Deepotsav & Mela',
        residentIds: ['face-1', 'face-4'],
        tags: ['Puja', 'Diyas', 'Temple', 'Maha-Aarti'],
        photographer: 'Rohan Sharma (Tower B-402)'
      },
      {
        id: 'diwali-p2',
        url: 'https://images.unsplash.com/photo-1514480571732-f3f80c6c8e3a?auto=format&fit=crop&w=800&q=80',
        caption: 'Children celebrating with eco-friendly phooljhadi and sparklers on the lawn',
        takenAt: '8:40 PM',
        eventId: 'diwali-2024',
        eventTitle: 'Grand Diwali Deepotsav & Mela',
        residentIds: ['face-2', 'face-3'],
        tags: ['Children', 'Celebration', 'Sparklers'],
        photographer: 'Anita Verma (Tower A-701)'
      },
      {
        id: 'diwali-p3',
        url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
        caption: 'Winning peacock rangoli created by Tower C ladies committee',
        takenAt: '6:30 PM',
        eventId: 'diwali-2024',
        eventTitle: 'Grand Diwali Deepotsav & Mela',
        residentIds: ['face-1', 'face-5'],
        tags: ['Rangoli', 'Competition', 'Colors'],
        photographer: 'Amitabh Joshi'
      },
      {
        id: 'diwali-p4',
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        caption: 'Traditional family portraits at the floral photobooth',
        takenAt: '9:10 PM',
        eventId: 'diwali-2024',
        eventTitle: 'Grand Diwali Deepotsav & Mela',
        residentIds: ['face-1', 'face-2', 'face-6'],
        tags: ['Family', 'Traditional', 'Photobooth'],
        photographer: 'Rohan Sharma'
      },
      {
        id: 'diwali-p5',
        url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
        caption: 'Hot Jalebi and Rabri live counter at community feast',
        takenAt: '8:00 PM',
        eventId: 'diwali-2024',
        eventTitle: 'Grand Diwali Deepotsav & Mela',
        residentIds: ['face-3'],
        tags: ['Food', 'Sweets', 'Feast'],
        photographer: 'Vikram Mehta'
      },
      {
        id: 'diwali-p6',
        url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
        caption: 'Illumination of Tower A to D balconies with fairy lights',
        takenAt: '10:00 PM',
        eventId: 'diwali-2024',
        eventTitle: 'Grand Diwali Deepotsav & Mela',
        residentIds: ['face-4'],
        tags: ['Decorations', 'NightView'],
        photographer: 'Anita Verma'
      }
    ]
  },
  {
    id: 'holi-2024',
    title: 'Holi Rangotsav & Rain Dance',
    hindiTitle: 'होली रंगोत्सव एवं सांस्कृतिक मिलन',
    date: '25 Mar 2024',
    year: 2024,
    location: 'Society Amphitheatre & Sports Arena',
    attendeesCount: 520,
    photoCount: 420,
    coverImage: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80',
    colorAccent: '#ec4899',
    description: 'Vibrant celebration with 100% organic herbal gulal, high-energy live Punjabi Dhol, organic thandai bar, rain dance setup, and traditional gujiya sharing.',
    highlights: ['Organic Herbal Gulal Only', 'Live Nashik & Punjabi Dhol', 'Kesariya Thandai & Gujiyas', 'Rain Dance for Kids & Youth'],
    photos: [
      {
        id: 'holi-p1',
        url: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=800&q=80',
        caption: 'Colors flying in the air as the youth group danced to dhol rhythms',
        takenAt: '11:15 AM',
        eventId: 'holi-2024',
        eventTitle: 'Holi Rangotsav & Rain Dance',
        residentIds: ['face-1', 'face-3', 'face-4'],
        tags: ['Gulal', 'Dance', 'Dhol'],
        photographer: 'Sunil Rao (B-103)'
      },
      {
        id: 'holi-p2',
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
        caption: 'Society elders and committee members greeting with Chandan teeka',
        takenAt: '10:00 AM',
        eventId: 'holi-2024',
        eventTitle: 'Holi Rangotsav & Rain Dance',
        residentIds: ['face-4', 'face-5'],
        tags: ['Elders', 'Traditional', 'Blessings'],
        photographer: 'Sunil Rao'
      },
      {
        id: 'holi-p3',
        url: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&w=800&q=80',
        caption: 'Children playfully spraying water with colorful pichkaris',
        takenAt: '12:20 PM',
        eventId: 'holi-2024',
        eventTitle: 'Holi Rangotsav & Rain Dance',
        residentIds: ['face-2'],
        tags: ['Kids', 'Pichkari', 'Fun'],
        photographer: 'Anita Verma'
      },
      {
        id: 'holi-p4',
        url: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
        caption: 'The colony youth group triumphantly covered in pink and yellow gulal',
        takenAt: '1:45 PM',
        eventId: 'holi-2024',
        eventTitle: 'Holi Rangotsav & Rain Dance',
        residentIds: ['face-1', 'face-2', 'face-3'],
        tags: ['GroupPhoto', 'Colors', 'Smile'],
        photographer: 'Rohan Sharma'
      }
    ]
  },
  {
    id: 'ganesh-2024',
    title: 'Ganesh Chaturthi & Visarjan Mahotsav',
    hindiTitle: 'गणेशोत्सव एवं महाविसर्जन यात्रा',
    date: '7 Sep 2024',
    year: 2024,
    location: 'Clubhouse Mandap & Eco-Immersion Pond',
    attendeesCount: 610,
    photoCount: 380,
    coverImage: 'https://images.unsplash.com/photo-1630959305606-3123a081dada?auto=format&fit=crop&w=1200&q=80',
    colorAccent: '#ef4444',
    description: '10-day celebration welcoming eco-friendly Clay Bappa, daily evening grand maha-aarti, modak cooking workshop, kids shloka chanting, and majestic visarjan procession.',
    highlights: ['100% Eco-Friendly Clay Idol', '5,100 Modaks Maha-Prasad', 'Daily Evening Aarti & Bhajan', 'Grand Dhol-Tasha Visarjan'],
    photos: [
      {
        id: 'ganesh-p1',
        url: 'https://images.unsplash.com/photo-1630959305606-3123a081dada?auto=format&fit=crop&w=800&q=80',
        caption: 'Stunning 8ft Clay Ganpati adorned with yellow marigold garlands and royal canopy',
        takenAt: '6:00 PM',
        eventId: 'ganesh-2024',
        eventTitle: 'Ganesh Chaturthi & Visarjan Mahotsav',
        residentIds: ['face-1', 'face-5'],
        tags: ['Bappa', 'Mandap', 'Puja'],
        photographer: 'Pooja Kulkarni (C-501)'
      },
      {
        id: 'ganesh-p2',
        url: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=800&q=80',
        caption: 'Evening Maha-Aarti with over 200 residents singing Jai Ganesh Deva',
        takenAt: '7:30 PM',
        eventId: 'ganesh-2024',
        eventTitle: 'Ganesh Chaturthi & Visarjan Mahotsav',
        residentIds: ['face-3', 'face-4'],
        tags: ['Aarti', 'Devotion', 'Singing'],
        photographer: 'Pooja Kulkarni'
      },
      {
        id: 'ganesh-p3',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        caption: 'Prize distribution for kids classical bhajan and dance competition',
        takenAt: '8:45 PM',
        eventId: 'ganesh-2024',
        eventTitle: 'Ganesh Chaturthi & Visarjan Mahotsav',
        residentIds: ['face-1', 'face-2'],
        tags: ['Kids', 'Competition', 'Prizes'],
        photographer: 'Rohan Sharma'
      }
    ]
  },
  {
    id: 'navratri-2024',
    title: 'Navratri Dandiya & Garba Raas Nights',
    hindiTitle: 'नवरात्रि डांडिया एवं गरबा रास उत्सव',
    date: '10 Oct 2024',
    year: 2024,
    location: 'Central Podium Complex',
    attendeesCount: 650,
    photoCount: 450,
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    colorAccent: '#8b5cf6',
    description: 'Electrifying 3-night Garba festival with 7-circle circular choreographies, traditional Gujarati orchestra, best dressed traditional costume contest, and midnight buffet.',
    highlights: ['3 Consecutive Dance Nights', 'Live Gujarati Folk Orchestra', 'Best Traditional Dress Awards', 'Late Night Fafda & Jalebi'],
    photos: [
      {
        id: 'navratri-p1',
        url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
        caption: 'Mesmerizing synchronized Garba swirls with wooden dandiya sticks',
        takenAt: '9:30 PM',
        eventId: 'navratri-2024',
        eventTitle: 'Navratri Dandiya & Garba Raas Nights',
        residentIds: ['face-1', 'face-2', 'face-4'],
        tags: ['Garba', 'Dandiya', 'Traditional'],
        photographer: 'Kunal Patel (A-201)'
      },
      {
        id: 'navratri-p2',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        caption: 'Winners of the Best Traditional Chaniya Choli and Kedia award',
        takenAt: '11:15 PM',
        eventId: 'navratri-2024',
        eventTitle: 'Navratri Dandiya & Garba Raas Nights',
        residentIds: ['face-1', 'face-6'],
        tags: ['Costumes', 'Awards', 'Festive'],
        photographer: 'Kunal Patel'
      }
    ]
  },
  {
    id: 'independence-2024',
    title: '78th Independence Day & Children’s Parade',
    hindiTitle: 'स्वतंत्रता दिवस एवं बाल देशभक्ति परेड',
    date: '15 Aug 2024',
    year: 2024,
    location: 'Main Gate & Flag Post Flagpole',
    attendeesCount: 390,
    photoCount: 220,
    coverImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    colorAccent: '#10b981',
    description: 'Tricolor flag hoisting ceremony by veteran army colonel resident, national anthem, freedom fighter fancy dress show by society toddlers, and laddu distribution.',
    highlights: ['Flag Hoisting by Col. Rajan (Retd.)', 'Tricolor Balloon Release', 'Fancy Dress (50+ Children)', 'Warm Jalebi & Dhokla Breakfast'],
    photos: [
      {
        id: 'ind-p1',
        url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
        caption: 'Tricolor proudly unfurled as 400 voices sang the National Anthem in unison',
        takenAt: '9:00 AM',
        eventId: 'independence-2024',
        eventTitle: '78th Independence Day & Children’s Parade',
        residentIds: ['face-3', 'face-5'],
        tags: ['FlagHoisting', 'Patriotic', 'Community'],
        photographer: 'Rohan Sharma'
      },
      {
        id: 'ind-p2',
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
        caption: 'Little Subhash Chandra Bose and Rani Laxmibai during the kids fancy dress',
        takenAt: '10:15 AM',
        eventId: 'independence-2024',
        eventTitle: '78th Independence Day & Children’s Parade',
        residentIds: ['face-2', 'face-6'],
        tags: ['Kids', 'FancyDress', 'Costumes'],
        photographer: 'Anita Verma'
      }
    ]
  }
];

export const SOCIETY_GUIDE_TOPICS: SocietyGuideTopic[] = [
  {
    id: 'photos-management',
    title: 'How to Handle 300+ Photos Per Event Without Crashing or High Costs',
    tagline: 'Simple, bulletproof storage strategy that saves 95% bandwidth & costs',
    icon: 'HardDrive',
    summaryHindi: 'हर इवेंट में 300 से 500 फोटो होती हैं — इन्हें व्हाट्सएप पर भेजने से क्वालिटी खराब होती है और फोन भर जाता है। जानिए बिना सर्वर क्रैश और बिना खर्चे के वेबसाइट पर कैसे संभालें!',
    fullGuide: {
      problemStatement: 'In housing societies, high-resolution DSLR and smartphone photos are 5MB to 12MB each. Uploading 300 raw photos equals 2.5 GB to 3.5 GB! If 200 residents open the website at the same time, the server crashes and bandwidth bills skyrocket.',
      recommendedSolution: 'Use a 3-Layer Smart Pipeline: (1) Client-Side In-Browser Compression to WebP, (2) Dedicated Cloud Media Storage with CDN, and (3) On-Demand High-Res Downloads.',
      stepByStep: [
        'Step 1: In-Browser WebP Conversion: Before uploading, browser compresses 8MB JPG into a crystal-clear 380KB WebP image (95% size reduction with zero visible quality loss).',
        'Step 2: Upload to Cloud Storage: The 300 photos become just ~110 MB total instead of 2.5 GB! Upload them to Cloudinary or Firebase Storage.',
        'Step 3: Serve via Global CDN: Cloudflare or Cloudinary caches images across Indian edge servers (Mumbai, Delhi, Bangalore) so images load instantly in 0.2 seconds on mobile data.',
        'Step 4: Keep Original RAW on Google Drive: Store the raw 4K uncompressed zip folder on a free Society Google Drive account and provide a "Download Full RAW Zip" button for photography buffs.'
      ],
      costBreakdown: [
        { item: 'Cloudinary Media Storage', cost: '₹0 (Free Forever)', frequency: 'Monthly', notes: 'Free tier gives 25 GB storage and 25,000 transformations per month, enough for 15+ events!' },
        { item: 'Firebase Cloud Storage', cost: '₹0 - ₹20', frequency: 'Monthly', notes: 'First 5 GB free. Beyond that, only ₹1.80 per GB per month.' },
        { item: 'Cloudflare Free CDN', cost: '₹0 (Free Forever)', frequency: 'Lifetime', notes: 'Free SSL, unmetered DDoS protection, and lightning-fast India edge caching.' }
      ],
      techStack: [
        { name: 'Cloudinary / Firebase', badge: 'Recommended', role: 'Photo Hosting & Thumbnails', freeTier: '25 GB / 5 GB free' },
        { name: 'Browser-Image-Compression', badge: 'Client Engine', role: 'Auto-converts 10MB to 350KB', freeTier: '100% Free Open Source' },
        { name: 'Cloudflare', badge: 'Fast Delivery', role: 'CDN & SSL Security', freeTier: '100% Free plan' }
      ],
      proTips: [
        'Tip: Never upload raw 48-megapixel camera photos directly without converting to WebP.',
        'Tip: Always generate 2 sizes: Thumbnail (400px wide for grid view) and Display (1600px wide for lightbox).',
        'Tip: Set up automated month-wise folders (e.g., 2024-11_Diwali, 2024-03_Holi) so committee members can locate albums easily.'
      ]
    }
  },
  {
    id: 'domain-and-hosting',
    title: 'Domain & Hosting Setup Guide for Society Committees',
    tagline: 'Get your society an official .in or .org domain with 100% free hosting and SSL',
    icon: 'Globe',
    summaryHindi: 'अपनी कॉलोनी की वेबसाइट के लिए अपना नाम (जैसे www.gokuldhamsociety.in) कैसे लें और इसे इंटरनेट पर फ्री में कैसे चलाएं — पूरा आसान तरीका!',
    fullGuide: {
      problemStatement: 'Most society chairmen or secretaries fear that hosting a website requires costly IT agencies, recurring monthly maintenance contracts, and expensive servers.',
      recommendedSolution: 'Modern cloud platforms provide zero-cost static & serverless hosting with automatic 24/7 uptime, automated SSL certificates, and zero maintenance. The only recurring cost is the annual domain name (~₹499/year)!',
      stepByStep: [
        'Step 1: Buy the Domain Name: Go to Namecheap, GoDaddy, or Google Domains. Search for your society name, e.g., "shreegokuldham.in" or "greenwoodresidency.org". A .in domain costs approx ₹499 for the first year.',
        'Step 2: Free Cloud Hosting: Connect this app to Google Cloud Run, Vercel, or Firebase Hosting. All offer generous free tiers that easily handle 10,000+ page views per month without paying a single rupee.',
        'Step 3: Point DNS: In your domain registrar (GoDaddy/Namecheap), add CNAME and A-records provided by your host. Takes 15 minutes.',
        'Step 4: Automatic Free HTTPS: The hosting platform automatically issues a Let’s Encrypt SSL certificate so residents see the secure green padlock in their browser.'
      ],
      costBreakdown: [
        { item: 'Official .in Domain', cost: '₹499 - ₹799', frequency: 'Per Year', notes: 'Best for Indian housing societies (e.g. yourcolony.in).' },
        { item: 'Vercel / Cloud Run Hosting', cost: '₹0 (Free Tier)', frequency: 'Monthly', notes: 'Easily handles 50,000 monthly requests with 99.99% uptime.' },
        { item: 'SSL Security Certificate', cost: '₹0 (Free Automatic)', frequency: 'Lifetime', notes: 'Included automatically on all modern hosts.' }
      ],
      techStack: [
        { name: 'Namecheap / GoDaddy', badge: 'Domain Registrar', role: 'Domain Name ownership', freeTier: '₹499/yr' },
        { name: 'Cloud Run / Vercel', badge: 'Cloud Host', role: 'Hosts the web app 24/7', freeTier: 'Free tier included' },
        { name: 'Google Workspace / Zoho Mail', badge: 'Optional', role: 'Official info@society.in email', freeTier: 'Zoho free up to 5 emails' }
      ],
      proTips: [
        'Register the domain under the Society Management Committee official email (e.g., rwa.office@gmail.com), NOT a personal email of an individual resident, so control stays with the society even after elections.',
        'Always turn on Auto-Renew so the domain name never expires accidentally.',
        'A .in or .org.in domain establishes high credibility and local trust for residents.'
      ]
    }
  },
  {
    id: 'ai-face-matching',
    title: 'How the AI Face Matching System Works in Production',
    tagline: 'Allow residents to click a selfie and instantly find all their festival photos',
    icon: 'ScanFace',
    summaryHindi: '300-400 फोटो में से हर निवासी अपनी फोटो कैसे ढूंढ सकता है? जानिए फेस मैचिंग AI कैसे काम करता है और इसे कैसे इंटीग्रेट करें!',
    fullGuide: {
      problemStatement: 'Nobody has the patience to scroll through 400 photos on WhatsApp or Google Drive to find 3 photos of their family. An AI Face Search solves this instantly: resident uploads 1 selfie, and AI retrieves all their photos across every festival.',
      recommendedSolution: 'Two proven production approaches: (A) Client-Side On-Device Face-API.js (100% Free, zero privacy leak), or (B) Cloud Facial Indexing via AWS Rekognition / FaceIO / Google Cloud Vision.',
      stepByStep: [
        'Option A: On-Device Browser Match (100% Free): We use face-api.js or MediaPipe directly in the resident’s browser. When the committee uploads photos, face descriptors (128 facial landmark numbers) are pre-extracted and stored in a lightweight JSON file. When a resident uploads a selfie, their browser matches the vector in 0.5 seconds locally without sending their face to any external server!',
        'Option B: AWS Rekognition Collection: Create an AWS Rekognition Face Collection. When committee uploads an event, Rekognition indexes faces. Cost is only $0.001 per image search (approx ₹8 per 100 searches).',
        'Option C: FaceIO or Cloudflare Workers AI: Simple REST API endpoint that takes selfie base64 and returns matched photo IDs in milliseconds.'
      ],
      costBreakdown: [
        { item: 'Client-Side On-Device AI', cost: '₹0 (Free Forever)', frequency: 'Lifetime', notes: 'Runs using browser WebAssembly & WebGL. Zero cloud AI costs!' },
        { item: 'AWS Rekognition (Cloud)', cost: '₹50 - ₹150', frequency: 'Per Big Event', notes: 'Indexes 400 photos and handles 500 resident selfie searches for ~$1.50.' },
        { item: 'Google Gemini 2.5 Flash', cost: '₹0 - ₹20', frequency: 'Per Event', notes: 'Used for automatic captioning and event tag generation.' }
      ],
      techStack: [
        { name: 'MediaPipe / Face-API', badge: 'On-Device', role: 'Private in-browser face matching', freeTier: '100% Free' },
        { name: 'AWS Rekognition', badge: 'Cloud Pro', role: 'Scales to 10,000+ photos', freeTier: '1,000 free scans/mo' },
        { name: 'Canvas Crop Engine', badge: 'Frontend', role: 'Real-time face detection HUD', freeTier: 'Built into browser' }
      ],
      proTips: [
        'Always reassure residents that their selfie is processed in temporary memory for matching only and is NOT sold or shared with any advertising third-party.',
        'Provide a "Group Photo" flag so photos with multiple residents show up for everyone in the frame.',
        'Add a one-tap "Share to WhatsApp" button on matched photos so residents can flaunt their festive pictures with colony branding.'
      ]
    }
  }
];
