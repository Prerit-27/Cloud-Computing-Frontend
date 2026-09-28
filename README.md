⏺ The landing page draft is complete. Need to fix design, layout and any unnecessary components. Here's a summary of everything built:

  ---
  Project Structure

  src/
  ├── components/
  │   ├── Navbar/Navbar.jsx          # Sticky navbar with blur, mobile menu
  │   ├── Hero/Hero.jsx              # Full-screen hero with particles, floating cards
  │   ├── Trust/Trust.jsx            # Animated counter metrics section
  │   ├── Features/Features.jsx      # 6 staggered feature cards with hover glow
  │   ├── ExercisePreview/ExercisePreview.jsx  # Exercise cards with Unsplash images
  │   ├── MuscleGroup/MuscleGroup.jsx          # Interactive body map with hover badges
  │   ├── HowItWorks/HowItWorks.jsx  # 3-step timeline with connecting line
  │   ├── DashboardPreview/DashboardPreview.jsx # Mock dashboard with charts & calendar
  │   ├── Testimonials/Testimonials.jsx  # Glassmorphism testimonial cards
  │   ├── CTA/CTA.jsx                # Animated gradient CTA section
  │   ├── Footer/Footer.jsx          # 5-column footer with social icons
  │   └── ui/
  │       ├── SectionHeading.jsx     # Reusable section header with scroll animation
  │       └── CountUp.jsx            # Animated counter component
  ├── hooks/
  │   ├── useLenis.js                # Smooth scrolling
  │   └── useScrollProgress.js       # Scroll position tracking
  ├── utils/
  │   └── data.js                    # All static data & constants
  ├── pages/
  │   └── Home.jsx                   # Main page assembling all sections
  ├── utils/
  │   └── data.js                    # All static data & constants
  ├── pages/
  │   └── Home.jsx                   # Main page assembling all sections
  ├── App.jsx                        # Root component with Lenis
  ├── main.jsx                       # React entry point
  └── index.css                      # Tailwind v4 theme + global styles

  ├── main.jsx                       # React entry point
  └── index.css                      # Tailwind v4 theme + global styles

  Dependencies Installed

  - TailwindCSS v4 with @tailwindcss/vite plugin
  - Framer Motion v13 for animations
  - Lenis for smooth scrolling
  - Lucide React for icons
  - TailwindCSS v4 with @tailwindcss/vite plugin
  - Framer Motion v13 for animations
  - Lenis for smooth scrolling
  - Lucide React for icons
  - React Icons (FontAwesome 6) for social icons
  - React Router DOM v7 for routing
  - GSAP available if needed

  Key Design Decisions

  - Dark theme throughout: #070707 background, #111111 cards, #181818 secondary surfaces
  - Accent colors: #7CFF5B (green) primary, #5BE7FF (cyan) secondary
  - Subtle borders: rgba(255,255,255,0.08) — no harsh lines
  │   └── useScrollProgress.js       # Scroll position tracking
  ├── utils/
  │   └── data.js                    # All static data & constants
  ├── pages/
  │   └── Home.jsx                   # Main page assembling all sections
  ├── App.jsx                        # Root component with Lenis
  ├── main.jsx                       # React entry point
  └── index.css                      # Tailwind v4 theme + global styles

  Dependencies Installed

  - TailwindCSS v4 with @tailwindcss/vite plugin
  - Framer Motion v13 for animations
  - Lenis for smooth scrolling
  - Lucide React for icons
  - React Icons (FontAwesome 6) for social icons
  - React Router DOM v7 for routing
  - GSAP available if needed

  Key Design Decisions

  - Dark theme throughout: #070707 background, #111111 cards, #181818 secondary surfaces
  - Accent colors: #7CFF5B (green) primary, #5BE7FF (cyan) secondary
  - Subtle borders: rgba(255,255,255,0.08) — no harsh lines
  - Typography: Inter font, 4xl-8xl headings, tight tracking
  - Animations: Framer Motion scroll-triggered reveals, staggered cards, floating elements, hover lift effects
  - Glassmorphism: Backdrop blur on navbar, floating hero cards, testimonials
  - Mobile-first: Responsive grid, hamburger menu, stacked cards on small screens

  To Run

  npm run dev     # http://localhost:5173
  npm run build   # Production build → dist/