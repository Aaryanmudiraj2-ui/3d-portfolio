import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  savePortfolioToCloud,
  fetchPortfolioFromCloud,
  getFromLocalRegistry,
  saveToLocalRegistry,
  compressImageFile
} from './services/portfolioStorage';
import {
  ArrowUpRight,
  Copy,
  Check,
  Mail,
  Github,
  MapPin,
  GraduationCap,
  Award,
  Terminal,
  Sparkles,
  ExternalLink,
  X,
  Send,
  Wand2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Share2,
  MessageCircle,
  Instagram,
  Camera,
  Upload,
  RotateCw
} from 'lucide-react';

// ============================================================================
// ASSETS & DEFAULT PERSONALIZED DATA FOR AARYAN MUDIRAJ
// ============================================================================

const HERO_PORTRAIT_MALE_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png';
const HERO_PORTRAIT_FEMALE_URL = '/female-avatar.png';

const MARQUEE_GIFS_ROW_1 = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  // PBCOE CSE Department Portal Preview
  '/assets/pbcoe-cse-preview.png',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  // Distributed repeat for smooth infinite scroll
  '/assets/pbcoe-cse-preview.png',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif'
];

const MARQUEE_GIFS_ROW_2 = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  // Campus AI Hero Preview
  '/assets/campus-ai-hero.png',
  // "Hi I'm Aaryan" 3D Hero Portfolio Showcase Photo
  '/assets/aaryan-portfolio-hero.png',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  // 3D Female Hero Showcase (21:9)
  '/assets/female-portfolio-hero.png',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif'
];

const ABOUT_CORNER_IMAGES = {
  topLeft:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
  bottomLeft:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
  topRight:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
  bottomRight:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png'
};

interface ServiceItem {
  number: string;
  name: string;
  description: string;
  stack: string;
  tier: string;
}

interface ProjectItem {
  id: string;
  number: string;
  category: string;
  name: string;
  subtitle: string;
  description: string;
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
}

interface PortfolioProfile {
  firstName: string;
  fullName: string;
  roleTitle: string;
  heroTagline: string;
  portraitUrl: string;
  gender: 'male' | 'female';
  location: string;
  Availability: string;
  collegeOrCompany: string;
  email: string;
  githubUsername: string;
  aboutText: string;
  badges: string[];
  services: ServiceItem[];
  projects: ProjectItem[];
}

const DEFAULT_SERVICES_DATA: ServiceItem[] = [
  {
    number: '01',
    name: 'Full-Stack Web Development',
    description:
      'Building fast, responsive, and modern web applications with React, TypeScript, Vite, Tailwind CSS, and Node.js/Express backends deployed seamlessly on Vercel.',
    stack: 'React • TypeScript • Vite • Tailwind CSS • Express • Vercel',
    tier: 'End-to-End Web Apps & Portals'
  },
  {
    number: '02',
    name: 'AI & LLM App Engineering',
    description:
      'Designing interactive AI assistants, RAG prototypes, and agentic workflows powered by Google Gemini, Anthropic Claude, and Streamlit Community Cloud.',
    stack: 'Gemini API • Claude • Streamlit • Prompt Engineering • Firebase',
    tier: 'AI Copilots & Interactive Prototypes'
  },
  {
    number: '03',
    name: 'Computer Vision & HealthTech',
    description:
      'Developing markerless pose-estimation systems, gait & joint-angle rehabilitation trackers, and clinical decision dashboards inspired by SIH 2026 Innovate_Biovision.',
    stack: 'OpenPose • MediaPipe • CNNs • ABDM Architecture • Python',
    tier: 'Research & Hackathon Systems'
  },
  {
    number: '04',
    name: 'Data Structures & Algorithms',
    description:
      'Crafting optimized algorithmic solutions and scalable problem-solving architectures honed through the 90-Day Lakshya 9.0 DSA Challenge and NPTEL Competitive Programming.',
    stack: 'C++ • Python • Graph & DP Algorithms • Competitive Programming',
    tier: 'Algorithmic Optimization & Core CS'
  },
  {
    number: '05',
    name: 'Database & Cloud Systems',
    description:
      'Structuring reliable relational databases (SQL/DBMS), real-time Firebase backends, GitHub OAuth pipelines, and Linux-based deployment environments.',
    stack: 'SQL / DBMS • Google Firebase • Linux Fundamentals • Git / GitHub',
    tier: 'Backend Architecture & DevOps'
  }
];

const DEFAULT_PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'healthvibe-biovision',
    number: '01',
    category: 'SIH 2026 & HealthTech AI',
    name: 'HealthVibe & BioVision',
    subtitle: 'Team Leader — Smart India Hackathon 2026 (Innovate_Biovision, Team #123684)',
    description:
      'A full-stack AI digital healthcare and vision-based rehabilitation assessment platform (Aaryanmudiraj2-ui/health-vibe). Combines a Vite + React client and Express server with markerless smartphone pose estimation (MediaPipe/OpenPose) to track joint angles, gait cadence, and ABDM-aligned patient recovery metrics.',
    tech: ['React', 'Vite', 'Express.js', 'Computer Vision', 'MediaPipe', 'Vercel'],
    liveUrl: 'https://github.com/Aaryanmudiraj2-ui/health-vibe',
    repoUrl: 'https://github.com/Aaryanmudiraj2-ui/health-vibe',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85'
  },
  {
    id: 'pbcoe-admission-ai',
    number: '02',
    category: 'Campus Web & Gemini AI',
    name: 'PBCOE CSE & Admission AI',
    subtitle: 'Priyadarshini Bhagwati College of Engineering • Nagpur',
    description:
      'An editorial full-screen landing portal for the CSE Department (pbcoe-project) paired with an interactive Campus AI Admission Assistant (admission-assistant) featuring an interactive desk experience and Google Gemini API routing deployed on Vercel.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Google Gemini API', 'Vite', 'Vercel'],
    liveUrl: 'https://vercel.com/mudirajaaryan2-9351s-projects/admission-assistant',
    repoUrl: 'https://github.com/Aaryanmudiraj2-ui',
    col1Image1: '/assets/pbcoe-cse-preview.png',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2Image: '/assets/campus-ai-hero.png'
  },
  {
    id: 'cryptovibe-lakshya',
    number: '03',
    category: 'Personal & FinTech Data',
    name: 'CryptoVibe & Lakshya DSA',
    subtitle: 'Data-First Web Platform & 90-Day Algorithmic Engineering',
    description:
      'A service-oriented market intelligence and real-time data tracking platform (CryptoVibe) built with Streamlit, Firebase, and modern web APIs, alongside a 90-day streak of algorithmic problem-solving certified through CodeElevate Academy’s Lakshya 9.0 DSA Challenge.',
    tech: ['Streamlit', 'Firebase', 'Python', 'C++ / DSA', 'REST APIs', 'GitHub'],
    liveUrl: 'https://github.com/Aaryanmudiraj2-ui',
    repoUrl: 'https://github.com/Aaryanmudiraj2-ui',
    col1Image1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1Image2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2Image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
  }
];

const AARYAN_DEFAULT_PROFILE: PortfolioProfile = {
  firstName: 'Aaryan',
  fullName: 'Aaryan Manoj Mudiraj',
  gender: 'male',
  roleTitle: 'Software & AI Creator',
  heroTagline: 'a cs & ai creator driven by crafting striking and unforgettable projects',
  portraitUrl: HERO_PORTRAIT_MALE_URL,
  location: 'Nagpur, Maharashtra, India',
  Availability: 'Open to Internships & Hackathons',
  collegeOrCompany: 'B.Tech CSE @ Priyadarshini Bhagwati College of Engineering',
  email: 'mudirajaaryan2@gmail.com',
  githubUsername: 'Aaryanmudiraj2-ui',
  aboutText:
    'Pursuing Computer Science & Engineering at PBCOE Nagpur, i focus on full-stack web development, AI-powered applications, and competitive programming (DSA), i truly enjoy building high-impact systems that solve real problems and stand out. Let’s build something incredible together!',
  badges: [
    'B.Tech CSE @ PBCOE Nagpur',
    'SIH 2026 Team Leader (Innovate_Biovision)',
    'Lakshya 9.0 — 90 Days DSA Certified',
    'Outlier AI Contributor & NPTEL Scholar'
  ],
  services: DEFAULT_SERVICES_DATA,
  projects: DEFAULT_PROJECTS_DATA
};

// Role Presets for 1-Click Auto-Fill in the Visitor Customizer
const ROLE_PRESETS: Record<
  string,
  {
    roleTitle: string;
    heroTagline: string;
    services: ServiceItem[];
  }
> = {
  fullstack_ai: {
    roleTitle: 'Software & AI Creator',
    heroTagline: 'a cs & ai creator driven by crafting striking and unforgettable projects',
    services: DEFAULT_SERVICES_DATA
  },
  creator_3d: {
    roleTitle: '3D Creator & Motion Designer',
    heroTagline: 'a 3d creator driven by crafting striking and unforgettable projects',
    services: [
      {
        number: '01',
        name: '3D Modeling',
        description:
          'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
        stack: 'Blender • ZBrush • Cinema 4D • Substance Painter',
        tier: 'Custom 3D Assets & Worlds'
      },
      {
        number: '02',
        name: 'Rendering',
        description:
          'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
        stack: 'Octane • Redshift • Cycles • HDRI Studio Lighting',
        tier: 'Photorealistic Product Viz'
      },
      {
        number: '03',
        name: 'Motion Design',
        description:
          'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
        stack: 'After Effects • Houdini • Spline 3D • Framer Motion',
        tier: 'Interactive & Showreel Motion'
      },
      {
        number: '04',
        name: 'Branding',
        description:
          'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
        stack: 'Figma • Illustrator • Typography • Visual Systems',
        tier: 'Complete Brand Identity'
      },
      {
        number: '05',
        name: 'Web Design',
        description:
          'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
        stack: 'Figma • React • Tailwind CSS • WebGL / Three.js',
        tier: 'High-Impact Landing Pages'
      }
    ]
  },
  uiux_frontend: {
    roleTitle: 'Product Designer & Frontend Dev',
    heroTagline: 'a product designer driven by crafting intuitive and unforgettable interfaces',
    services: [
      {
        number: '01',
        name: 'UI / UX Design Systems',
        description:
          'Creating scalable component libraries, interactive wireframes, and high-contrast interfaces tailored for modern SaaS and mobile apps.',
        stack: 'Figma • Auto-Layout • Design Tokens • Prototyping',
        tier: 'Design Systems & UI Kits'
      },
      {
        number: '02',
        name: 'Interactive Frontend Engineering',
        description:
          'Translating pixel-perfect designs into fluid, responsive React and TypeScript web applications with smooth micro-interactions.',
        stack: 'React • TypeScript • Tailwind CSS • Framer Motion',
        tier: 'Production Web Interfaces'
      },
      {
        number: '03',
        name: 'Brand & Visual Storytelling',
        description:
          'Developing distinctive brand guidelines, editorial typography, and visual narratives that help startups stand out.',
        stack: 'Editorial Grids • Custom Type • Art Direction',
        tier: 'Startup Identity'
      },
      {
        number: '04',
        name: 'Conversion Landing Pages',
        description:
          'Building fast-loading, accessible, and SEO-friendly landing pages optimized for product launches and creator portfolios.',
        stack: 'Next.js • Vite • Vercel • Web Vitals Optimization',
        tier: 'Launch Ready Sites'
      },
      {
        number: '05',
        name: 'User Research & Auditing',
        description:
          'Conducting usability reviews, journey mapping, and accessibility audits to remove friction from core product flows.',
        stack: 'WCAG Accessibility • Heatmaps • A/B Testing',
        tier: 'UX Audits & Strategy'
      }
    ]
  }
};

// ============================================================================
// REUSABLE ANIMATION & UI COMPONENTS
// ============================================================================

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'nav' | 'header' | 'section' | 'p' | 'h1' | 'h2';
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  as = 'div'
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0px, 0px, 0px)' : `translate3d(${x}px, ${y}px, 0px)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        transitionDelay: `${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </Tag>
  );
};

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = ''
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        setIsActive(true);
        const offsetX = (e.clientX - centerX) / strength;
        const offsetY = (e.clientY - centerY) / strength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', style }) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const startY = vh * 0.8;
      const endY = vh * 0.2;
      const totalDistance = startY - endY + rect.height;
      const current = startY - rect.top;
      const raw = totalDistance > 0 ? current / totalDistance : 1;
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [text]);

  const words = text.split(' ');
  const totalChars = Math.max(1, text.length);
  let charCursor = 0;

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((word, wIdx) => {
        const wordChars = word.split('');
        const wordElement = (
          <span key={wIdx} className="inline-flex mr-[0.28em]">
            {wordChars.map((ch, cIdx) => {
              const index = charCursor++;
              const charStart = index / totalChars;
              const charEnd = charStart + 1 / totalChars;
              let charOpacity = 0.2;
              if (progress >= charEnd) {
                charOpacity = 1;
              } else if (progress > charStart) {
                const local = (progress - charStart) / (charEnd - charStart);
                charOpacity = 0.2 + local * 0.8;
              }
              return (
                <span key={cIdx} className="relative inline-block">
                  <span className="opacity-20 select-none">{ch}</span>
                  <span
                    className="absolute left-0 top-0 transition-opacity duration-75"
                    style={{ opacity: charOpacity }}
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
        );
        charCursor++;
        return wordElement;
      })}
    </p>
  );
};

interface ContactButtonProps {
  onClick: () => void;
  label?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ onClick, label = 'Contact Me' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px'
      }}
    >
      {label}
    </button>
  );
};

interface LiveProjectButtonProps {
  onClick: () => void;
  label?: string;
}

const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  onClick,
  label = 'Live Project'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 inline-flex items-center gap-2 cursor-pointer"
    >
      <span>{label}</span>
      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

// ============================================================================
// STICKY STACKING PROJECT CARD COMPONENT
// ============================================================================

interface StickyProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  onInspect: (project: ProjectItem) => void;
  onEditImages: (project: ProjectItem) => void;
}

const StickyProjectCard: React.FC<StickyProjectCardProps> = ({
  project,
  index,
  totalCards,
  onInspect,
  onEditImages
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (rect.top <= 120) {
        const scrolledPast = Math.min(1, Math.max(0, (120 - rect.top) / (vh * 0.85)));
        const interpolated = 1 - scrolledPast * (1 - targetScale);
        setScale(interpolated);
      } else {
        setScale(1);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetScale]);

  return (
    <div
      ref={wrapperRef}
      className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32"
      style={{
        paddingTop: `${index * 28}px`,
        zIndex: index + 1
      }}
    >
      <div
        className="w-full max-w-6xl mx-auto rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 shadow-2xl transition-transform duration-150 ease-out"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          willChange: 'transform'
        }}
      >
        {/* Top Row: Number, Category + Project Name + Tech Pills, Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 sm:pb-8">
          <div className="flex items-center gap-4 sm:gap-8">
            <span
              className="font-black text-[#D7E2EA] leading-none select-none"
              style={{ fontSize: 'clamp(3rem, 8vw, 110px)' }}
            >
              {project.number}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs sm:text-sm uppercase tracking-widest text-[#BBCCD7]/80 font-medium px-3 py-0.5 rounded-full border border-[#D7E2EA]/30">
                  {project.category}
                </span>
                <span className="text-xs text-[#BBCCD7]/60 hidden sm:inline">
                  {project.subtitle}
                </span>
              </div>
              <h3
                className="font-bold uppercase text-[#D7E2EA] tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.35rem, 3vw, 2.5rem)' }}
              >
                {project.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D7E2EA]/10 text-[#D7E2EA]/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => onEditImages(project)}
              className="rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] hover:bg-[#D7E2EA]/10 font-medium uppercase tracking-widest px-5 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors duration-200"
              title="Upload or change screenshots for this project"
            >
              <Camera className="w-4 h-4 text-[#BBCCD7]" />
              <span>Edit Images</span>
            </button>
            <LiveProjectButton onClick={() => onInspect(project)} />
          </div>
        </div>

        {/* Bottom Row: Two-column image grid (40% left stacked, 60% right tall) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
            <div
              className="w-full overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#D7E2EA]/20 relative group cursor-pointer"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
              onClick={() => onInspect(project)}
            >
              <img
                src={project.col1Image1}
                alt={`${project.name} preview 1`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditImages(project);
                  }}
                  className="rounded-full bg-black/80 backdrop-blur-md border border-[#D7E2EA]/50 text-[#D7E2EA] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg hover:bg-black hover:border-white transition-all hover:scale-105 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#BBCCD7]" />
                  <span>Change Image</span>
                </button>
              </div>
            </div>
            <div
              className="w-full overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#D7E2EA]/20 relative group cursor-pointer"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
              onClick={() => onInspect(project)}
            >
              <img
                src={project.col1Image2}
                alt={`${project.name} preview 2`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditImages(project);
                  }}
                  className="rounded-full bg-black/80 backdrop-blur-md border border-[#D7E2EA]/50 text-[#D7E2EA] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg hover:bg-black hover:border-white transition-all hover:scale-105 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#BBCCD7]" />
                  <span>Change Image</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="md:col-span-7 overflow-hidden rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#D7E2EA]/20 relative group cursor-pointer"
            style={{
              height: 'clamp(260px, calc(38vw + 1rem), 586px)'
            }}
            onClick={() => onInspect(project)}
          >
            <img
              src={project.col2Image}
              alt={`${project.name} main showcase`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditImages(project);
                }}
                className="rounded-full bg-black/80 backdrop-blur-md border border-[#D7E2EA]/50 text-[#D7E2EA] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg hover:bg-black hover:border-white transition-all hover:scale-105 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#BBCCD7]" />
                <span>Change Banner</span>
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/90 via-[#0C0C0C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 sm:p-8">
              <p className="text-[#D7E2EA] text-sm sm:text-base font-light leading-relaxed max-w-xl">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PROFILE URL SERIALIZATION & STORAGE HELPERS
// ============================================================================

const STORAGE_KEY = 'aaryan_portfolio_visitor_profile_v1';


function decodeProfileFromBase64(base64Str: string): PortfolioProfile | null {
  try {
    let base64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed === 'object' && parsed.firstName) {
      const gender: 'male' | 'female' = parsed.gender === 'female' ? 'female' : 'male';
      return {
        ...AARYAN_DEFAULT_PROFILE,
        ...parsed,
        gender,
        portraitUrl:
          parsed.portraitUrl && parsed.portraitUrl !== '/female-avatar.jpg'
            ? parsed.portraitUrl
            : (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)
      };
    }
  } catch (e) {
    console.error('Failed to decode profile from base64', e);
  }
  return null;
}

function generateProfileSlug(fullName: string, firstName: string): string {
  const name = fullName.trim() || firstName.trim() || 'creator';
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'creator'
  );
}

// ============================================================================
// MAIN PORTFOLIO APPLICATION
// ============================================================================

export default function App() {
  const marqueeRef = useRef<HTMLElement | null>(null);
  const [marqueeOffset, setMarqueeOffset] = useState(0);

  // Active Portfolio Profile State (Defaults to Aaryan Mudiraj or URL/localStorage)
  const [profile, setProfile] = useState<PortfolioProfile>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get('id');
        if (idParam) {
          const cached = getFromLocalRegistry(idParam);
          if (cached) {
            const gender: 'male' | 'female' = cached.gender === 'female' ? 'female' : 'male';
            return {
              ...AARYAN_DEFAULT_PROFILE,
              ...cached,
              gender,
              portraitUrl:
                cached.portraitUrl && cached.portraitUrl !== '/female-avatar.jpg'
                  ? cached.portraitUrl
                  : (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)
            };
          }
        }
        const creatorParam = params.get('creator');
        if (creatorParam) {
          const cached = getFromLocalRegistry(creatorParam);
          if (cached) {
            const gender: 'male' | 'female' = cached.gender === 'female' ? 'female' : 'male';
            return {
              ...AARYAN_DEFAULT_PROFILE,
              ...cached,
              gender,
              portraitUrl:
                cached.portraitUrl && cached.portraitUrl !== '/female-avatar.jpg'
                  ? cached.portraitUrl
                  : (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)
            };
          }
        }
        const dataParam = params.get('data');
        if (dataParam) {
          const decoded = decodeProfileFromBase64(dataParam);
          if (decoded) return decoded;
        }
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const gender: 'male' | 'female' = parsed.gender === 'female' ? 'female' : 'male';
        return {
          ...AARYAN_DEFAULT_PROFILE,
          ...parsed,
          gender,
          portraitUrl:
            parsed.portraitUrl && parsed.portraitUrl !== '/female-avatar.jpg'
              ? parsed.portraitUrl
              : (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)
        };
      }
    } catch {
      // Ignore storage errors
    }
    return AARYAN_DEFAULT_PROFILE;
  });

  const [isCustomVisitor, setIsCustomVisitor] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('id') || params.get('creator') || params.get('data')) return true;
      }
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });

  // Unique ID of currently saved cloud share
  const [activeShareId, setActiveShareId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('id') || '';
    }
    return '';
  });
  const [isSavingShare, setIsSavingShare] = useState<boolean>(false);

  // Visitor Q&A Customizer Wizard State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderStep, setBuilderStep] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState<string>('fullstack_ai');
  const [draftProfile, setDraftProfile] = useState<PortfolioProfile>(profile);
  const [builderBannerToast, setBuilderBannerToast] = useState<string | null>(null);

  // Share Modal State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedInstagram, setCopiedInstagram] = useState(false);

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>('01');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Project / Hackathon Collaboration',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Decode or fetch custom profile from URL parameters on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      const creatorParam = params.get('creator');
      const dataParam = params.get('data');

      // 1. Unique Cloud ID in URL (?id=ff8081...)
      if (idParam) {
        setActiveShareId(idParam);
        fetchPortfolioFromCloud(idParam).then((cloudData) => {
          if (cloudData) {
            const gender: 'male' | 'female' = cloudData.gender === 'female' ? 'female' : 'male';
            const merged: PortfolioProfile = {
              ...AARYAN_DEFAULT_PROFILE,
              ...cloudData,
              gender,
              portraitUrl:
                cloudData.portraitUrl && cloudData.portraitUrl !== '/female-avatar.jpg'
                  ? cloudData.portraitUrl
                  : (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)
            };
            setProfile(merged);
            setDraftProfile(merged);
            setIsCustomVisitor(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            setBuilderBannerToast(`Viewing custom 3D portfolio for ${merged.fullName}!`);
            setTimeout(() => setBuilderBannerToast(null), 4000);
          }
        });
        return;
      }

      // 2. Creator Slug in URL (?creator=slug)
      if (creatorParam && !dataParam) {
        const cached = getFromLocalRegistry(creatorParam);
        if (cached) {
          const gender: 'male' | 'female' = cached.gender === 'female' ? 'female' : 'male';
          const merged: PortfolioProfile = {
            ...AARYAN_DEFAULT_PROFILE,
            ...cached,
            gender,
            portraitUrl:
              cached.portraitUrl && cached.portraitUrl !== '/female-avatar.jpg'
                ? cached.portraitUrl
                : (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)
          };
          setProfile(merged);
          setDraftProfile(merged);
          setIsCustomVisitor(true);
          setBuilderBannerToast(`Viewing custom 3D portfolio for ${merged.fullName}!`);
          setTimeout(() => setBuilderBannerToast(null), 4000);
          return;
        }
      }

      // 3. Fallback backward compatibility for legacy ?data=<base64>
      if (dataParam) {
        const decoded = decodeProfileFromBase64(dataParam);
        if (decoded) {
          setProfile(decoded);
          setDraftProfile(decoded);
          setIsCustomVisitor(true);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
          } catch {}
          setBuilderBannerToast(`Viewing custom 3D portfolio for ${decoded.fullName}!`);
          setTimeout(() => setBuilderBannerToast(null), 4000);
        }
      }
    } catch (e) {
      console.error('Error hydrating profile from URL on mount', e);
    }
  }, []);

  // Dynamically update document title whenever profile changes
  useEffect(() => {
    document.title = `${profile.firstName} — ${profile.roleTitle}`;
  }, [profile.firstName, profile.roleTitle]);

  // Scroll-driven Marquee offset calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!marqueeRef.current) return;
      const rect = marqueeRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const sectionTop = rect.top + scrollY;
      const offset = (scrollY - sectionTop + window.innerHeight) * 0.3;
      setMarqueeOffset(offset);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleCopyEmail = useCallback(() => {
    const email = profile.email;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  }, [profile.email]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        subject: 'Project / Hackathon Collaboration',
        message: ''
      });
      setIsContactOpen(false);
    }, 2500);
  };

  // Open Q&A Builder
  const openBuilderModal = () => {
    setDraftProfile(profile);
    setBuilderStep(1);
    setIsBuilderOpen(true);
  };

  // Apply Role Preset inside Q&A Builder
  const applyPresetToDraft = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = ROLE_PRESETS[presetKey];
    if (!preset) return;
    setDraftProfile((prev) => ({
      ...prev,
      roleTitle: preset.roleTitle,
      heroTagline: preset.heroTagline,
      services: preset.services
    }));
  };

  // Auto-generate About paragraph from visitor answers
  const autoGenerateAboutFromAnswers = () => {
    const collegeText = draftProfile.collegeOrCompany || 'my institution';
    const roleText = draftProfile.roleTitle || 'software and creative engineering';
    const badgeHighlight =
      draftProfile.badges.filter(Boolean).slice(0, 2).join(' and ') ||
      'shipping impactful digital products';
    const generated = `Based in ${
      draftProfile.location || 'India'
    } (${collegeText}), i specialize in ${roleText.toLowerCase()} with a focus on ${badgeHighlight.toLowerCase()}. i truly enjoy turning ambitious ideas into high-impact, unforgettable digital experiences. Let’s build something incredible together!`;
    setDraftProfile((prev) => ({ ...prev, aboutText: generated }));
  };

  // Computed clean, clutter-free URL for sharing the current portfolio profile
  const currentShareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const slug = generateProfileSlug(profile.fullName, profile.firstName);
    if (activeShareId) {
      return `${origin}${pathname}?id=${encodeURIComponent(activeShareId)}`;
    }
    return `${origin}${pathname}?creator=${encodeURIComponent(slug)}`;
  }, [profile.fullName, profile.firstName, activeShareId]);

  const handleCopyShareLink = useCallback(() => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentShareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentShareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = currentShareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  }, [currentShareUrl]);

  const handleCopyInstagramCaption = useCallback(() => {
    const caption = `🚀 My New 3D Interactive Portfolio is Live!\n✨ ${profile.fullName} — ${profile.roleTitle}\n📍 ${profile.location} (${profile.collegeOrCompany})\n🔗 Experience the 3D site live (link in bio):\n${currentShareUrl}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(caption);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = caption;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = caption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedInstagram(true);
    setTimeout(() => setCopiedInstagram(false), 2500);
  }, [profile.fullName, profile.roleTitle, profile.location, profile.collegeOrCompany, currentShareUrl]);

  // Save & Apply Visitor Profile
  const handleApplyVisitorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFirst = draftProfile.firstName.trim() || 'Creator';
    const cleanedFull = draftProfile.fullName.trim() || cleanedFirst;
    const gender: 'male' | 'female' = draftProfile.gender === 'female' ? 'female' : 'male';
    const portraitUrl =
      draftProfile.portraitUrl ||
      (gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL);

    const updated: PortfolioProfile = {
      ...draftProfile,
      firstName: cleanedFirst,
      fullName: cleanedFull,
      gender,
      portraitUrl
    };

    setProfile(updated);
    setDraftProfile(updated);
    setIsCustomVisitor(true);
    setIsBuilderOpen(false);

    const slug = generateProfileSlug(cleanedFull, cleanedFirst);

    // 1. Immediately update browser URL to clean, clutter-free URL (NO base64!)
    if (typeof window !== 'undefined') {
      const cleanUrl = `${window.location.origin}${window.location.pathname}?creator=${encodeURIComponent(slug)}`;
      window.history.replaceState(null, '', cleanUrl);
    }

    // 2. Persist to localStorage & local registry
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      saveToLocalRegistry(slug, updated);
    } catch {
      // Ignore storage error
    }

    // 3. Open Share Modal with preview card and clean links
    setIsShareOpen(true);
    setBuilderBannerToast(`Portfolio updated for ${cleanedFull}!`);
    setTimeout(() => setBuilderBannerToast(null), 4000);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. Save to Cloud Database in background to obtain short unique ID (?id=xyz)
    setIsSavingShare(true);
    if (typeof window !== 'undefined') {
      savePortfolioToCloud(updated, window.location.origin, window.location.pathname)
        .then((saved) => {
          if (saved && saved.id) {
            setActiveShareId(saved.id);
            window.history.replaceState(null, '', saved.shareUrl);
          }
        })
        .finally(() => {
          setIsSavingShare(false);
        });
    }
  };

  // Reset back to Aaryan's Original Portfolio
  const handleResetToAaryan = () => {
    setProfile(AARYAN_DEFAULT_PROFILE);
    setDraftProfile(AARYAN_DEFAULT_PROFILE);
    setIsCustomVisitor(false);
    setIsBuilderOpen(false);
    setIsShareOpen(false);
    setActiveShareId('');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setBuilderBannerToast("Restored Aaryan Mudiraj's default portfolio!");
    setTimeout(() => setBuilderBannerToast(null), 3500);
  };

  // Save & Apply Project Media (Screenshots & Showcase Images)
  const handleSaveProjectMedia = (updatedProj: ProjectItem) => {
    const updatedProjects = profile.projects.map((p) =>
      p.id === updatedProj.id ? updatedProj : p
    );
    const updatedProfile: PortfolioProfile = {
      ...profile,
      projects: updatedProjects
    };

    setProfile(updatedProfile);
    setDraftProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === updatedProj.id ? updatedProj : p))
    }));
    setIsCustomVisitor(true);
    setEditingProject(null);
    setUploadingSlot(null);

    const slug = generateProfileSlug(updatedProfile.fullName, updatedProfile.firstName);

    // 1. Immediately cache in localStorage & local registry
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      saveToLocalRegistry(slug, updatedProfile);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 2. Sync to cloud database for clean short link
    setIsSavingShare(true);
    if (typeof window !== 'undefined') {
      savePortfolioToCloud(updatedProfile, window.location.origin, window.location.pathname)
        .then((saved) => {
          if (saved && saved.id) {
            setActiveShareId(saved.id);
            window.history.replaceState(null, '', saved.shareUrl);
          }
        })
        .finally(() => {
          setIsSavingShare(false);
        });
    }

    setBuilderBannerToast(`Updated screenshots for ${updatedProj.name}!`);
    setTimeout(() => setBuilderBannerToast(null), 4000);
  };

  const row1Tripled = [...MARQUEE_GIFS_ROW_1, ...MARQUEE_GIFS_ROW_1, ...MARQUEE_GIFS_ROW_1];
  const row2Tripled = [...MARQUEE_GIFS_ROW_2, ...MARQUEE_GIFS_ROW_2, ...MARQUEE_GIFS_ROW_2];

  // Dynamic font sizing for Hero Heading based on name length so it never clips
  const heroGreetingLength = (`Hi, i'm ${profile.firstName}`).length;
  const heroFontSizeClass =
    heroGreetingLength <= 12
      ? 'text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]'
      : heroGreetingLength <= 15
      ? 'text-[11.2vw] sm:text-[12vw] md:text-[12.8vw] lg:text-[13.5vw]'
      : 'text-[9vw] sm:text-[9.8vw] md:text-[10.5vw] lg:text-[11vw]';

  const badgeIcons = [GraduationCap, Award, Terminal, Sparkles];

  return (
    <div
      className="min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA] selection:bg-[#B600A8] selection:text-white"
      style={{
        fontFamily: "'Kanit', sans-serif",
        overflowX: 'clip'
      }}
    >
      {/* Toast Notification when Portfolio is Customized or Reset */}
      {builderBannerToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#18011F] border border-[#D7E2EA] text-white text-xs sm:text-sm font-medium uppercase tracking-wider shadow-2xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B600A8]" />
          <span>{builderBannerToast}</span>
        </div>
      )}

      {/* Centered Floating Pill Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-[#121316]/90 border border-[#D7E2EA]/30 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] max-w-[95vw]">
        {/* Share Button (when custom visitor profile active) */}
        {isCustomVisitor && (
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            title="Share your custom 3D Portfolio"
            className="rounded-full bg-[#1A1C22] border border-[#D7E2EA]/30 text-[#D7E2EA] px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#D7E2EA]/15 hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B600A8]" />
            <span>Share</span>
          </button>
        )}

        {/* Try Your Own Details / Edit Details Button */}
        <button
          type="button"
          onClick={openBuilderModal}
          className="rounded-full text-white font-medium uppercase tracking-wider px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
          style={{
            background:
              'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
            boxShadow:
              '0px 4px 14px rgba(181, 1, 167, 0.45), 4px 4px 12px #7721B1 inset',
            outline: '1.5px solid #FFFFFF',
            outlineOffset: '-1.5px'
          }}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>
            {isCustomVisitor
              ? `Edit ${profile.firstName}'s Details`
              : 'Try Your Own Details'}
          </span>
        </button>

        {/* Reset to Aaryan Button */}
        {isCustomVisitor && (
          <button
            type="button"
            onClick={handleResetToAaryan}
            title="Reset to Aaryan Mudiraj's Portfolio"
            className="rounded-full bg-[#0C0C0C]/80 border border-[#D7E2EA]/20 text-[#D7E2EA]/80 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider font-medium hover:bg-[#D7E2EA]/15 hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* ================================================================== */}
      {/* 1. HERO SECTION                                                    */}
      {/* ================================================================== */}
      <section
        id="hero"
        className="h-screen w-full flex flex-col justify-between relative"
        style={{ overflowX: 'clip' }}
      >
        {/* Top Container: Navbar + Massive Hero Heading */}
        <div className="w-full relative z-20">
          {/* Navbar */}
          <FadeIn delay={0} y={-20} as="nav">
            <div className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-0"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-0"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-0"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-0"
              >
                Contact
              </button>
            </div>
          </FadeIn>

          {/* Hero Heading */}
          <div className="overflow-hidden w-full px-2 sm:px-4">
            <FadeIn delay={0.15} y={40}>
              <h1
                className={`hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center ${heroFontSizeClass} mt-4 sm:mt-3 md:-mt-2 select-none drop-shadow-md`}
              >
                Hi, i&apos;m {profile.firstName}
              </h1>
            </FadeIn>
          </div>
        </div>

        {/* Hero Portrait (Centered Absolutely with Magnetic Effect) */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] xs:w-[340px] sm:w-[420px] md:w-[500px] lg:w-[580px] xl:w-[640px] bottom-0 pointer-events-auto flex items-end justify-center">
          <FadeIn delay={0.6} y={30}>
            <Magnet
              padding={140}
              strength={2.8}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
            >
              <img
                src={profile.portraitUrl || HERO_PORTRAIT_MALE_URL}
                alt={`${profile.fullName} — ${profile.roleTitle}`}
                className="w-full max-h-[55vh] sm:max-h-[62vh] md:max-h-[68vh] lg:max-h-[74vh] object-contain object-bottom select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
              />
            </Magnet>
          </FadeIn>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              {profile.heroTagline}
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <ContactButton onClick={() => setIsContactOpen(true)} />
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. MARQUEE SECTION                                                 */}
      {/* ================================================================== */}
      <section
        ref={marqueeRef}
        id="showcase"
        className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
      >
        <div className="flex flex-col gap-3">
          {/* Row 1: first 11 images tripled, moves RIGHT on scroll */}
          <div
            className="flex gap-3 w-max"
            style={{
              transform: `translate3d(${(marqueeOffset % 1400) - 900}px, 0, 0)`,
              willChange: 'transform'
            }}
          >
            {row1Tripled.map((src, idx) => (
              <img
                key={`r1-${idx}`}
                src={src}
                alt={`Interactive motion showcase ${idx + 1}`}
                loading="lazy"
                className="w-[300px] h-[195px] sm:w-[420px] sm:h-[270px] rounded-2xl object-cover shrink-0 border border-[#D7E2EA]/10"
              />
            ))}
          </div>

          {/* Row 2: remaining 10 images tripled, moves LEFT on scroll */}
          <div
            className="flex gap-3 w-max"
            style={{
              transform: `translate3d(${-((marqueeOffset % 1400) - 200)}px, 0, 0)`,
              willChange: 'transform'
            }}
          >
            {row2Tripled.map((src, idx) => (
              <img
                key={`r2-${idx}`}
                src={src}
                alt={`Digital experience preview ${idx + 1}`}
                loading="lazy"
                className="w-[300px] h-[195px] sm:w-[420px] sm:h-[270px] rounded-2xl object-cover shrink-0 border border-[#D7E2EA]/10"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. ABOUT SECTION                                                   */}
      {/* ================================================================== */}
      <section
        id="about"
        className="min-h-screen w-full px-5 sm:px-8 md:px-10 py-20 relative flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Corner 3D images */}
        <FadeIn
          delay={0.1}
          x={-80}
          y={0}
          duration={0.9}
          className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-0"
        >
          <img
            src={ABOUT_CORNER_IMAGES.topLeft}
            alt="Decorative 3D Moon"
            className="w-full h-auto object-contain"
          />
        </FadeIn>

        <FadeIn
          delay={0.25}
          x={-80}
          y={0}
          duration={0.9}
          className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none select-none z-0"
        >
          <img
            src={ABOUT_CORNER_IMAGES.bottomLeft}
            alt="Decorative 3D Object"
            className="w-full h-auto object-contain"
          />
        </FadeIn>

        <FadeIn
          delay={0.15}
          x={80}
          y={0}
          duration={0.9}
          className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-0"
        >
          <img
            src={ABOUT_CORNER_IMAGES.topRight}
            alt="Decorative 3D Lego"
            className="w-full h-auto object-contain"
          />
        </FadeIn>

        <FadeIn
          delay={0.3}
          x={80}
          y={0}
          duration={0.9}
          className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none select-none z-0"
        >
          <img
            src={ABOUT_CORNER_IMAGES.bottomRight}
            alt="Decorative 3D Group"
            className="w-full h-auto object-contain"
          />
        </FadeIn>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
            <FadeIn delay={0} y={40}>
              <h2
                className="hero-heading font-black uppercase leading-none tracking-tight text-center"
                style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
              >
                About me
              </h2>
            </FadeIn>

            <AnimatedText
              text={profile.aboutText}
              className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            />

            {/* Dynamic Credential Badges */}
            <FadeIn delay={0.2} y={20}>
              <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl">
                {profile.badges.filter(Boolean).map((badge, idx) => {
                  const IconComponent = badgeIcons[idx % badgeIcons.length];
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D7E2EA]/5 border border-[#D7E2EA]/20 text-xs sm:text-sm text-[#D7E2EA]/90"
                    >
                      <IconComponent className="w-4 h-4 text-[#BBCCD7]" />
                      {badge}
                    </span>
                  );
                })}
              </div>
            </FadeIn>
          </div>

          <div className="mt-16 sm:mt-20 md:mt-24 flex flex-wrap items-center justify-center gap-4">
            <FadeIn delay={0.3} y={20}>
              <ContactButton onClick={() => setIsContactOpen(true)} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. SERVICES SECTION                                                */}
      {/* ================================================================== */}
      <section
        id="services"
        className="w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10"
      >
        <FadeIn delay={0} y={40}>
          <h2
            className="text-[#0C0C0C] font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          {profile.services.map((item, i) => {
            const isExpanded = expandedService === item.number;
            return (
              <FadeIn key={item.number} delay={i * 0.1} y={30}>
                <div
                  onClick={() =>
                    setExpandedService(isExpanded ? null : item.number)
                  }
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-10 py-8 sm:py-10 md:py-12 cursor-pointer group transition-colors duration-200 hover:bg-[#0C0C0C]/[0.02] px-2 sm:px-4 rounded-2xl"
                  style={{
                    borderBottom: '1px solid rgba(12, 12, 12, 0.15)',
                    borderTop: i === 0 ? '1px solid rgba(12, 12, 12, 0.15)' : 'none'
                  }}
                >
                  <div
                    className="font-black text-[#0C0C0C] leading-none shrink-0 select-none"
                    style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                  >
                    {item.number}
                  </div>

                  <div className="flex flex-col gap-2 max-w-2xl w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className="font-medium uppercase text-[#0C0C0C] tracking-wide"
                        style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                      >
                        {item.name}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-[#0C0C0C]/5 text-[#0C0C0C]/70 shrink-0">
                        {item.tier}
                      </span>
                    </div>

                    <p
                      className="font-light leading-relaxed text-[#0C0C0C] max-w-2xl"
                      style={{
                        fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                        opacity: 0.6
                      }}
                    >
                      {item.description}
                    </p>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#0C0C0C]/10 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-medium text-[#0C0C0C]/80">
                          Core Stack: {item.stack}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContactForm((prev) => ({
                              ...prev,
                              subject: `Inquiry: ${item.name}`
                            }));
                            setIsContactOpen(true);
                          }}
                          className="text-xs uppercase tracking-widest font-semibold text-[#7621B0] hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
                        >
                          Collaborate on this <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. PROJECTS SECTION                                                */}
      {/* ================================================================== */}
      <section
        id="projects"
        className="w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-28"
      >
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-12 sm:mb-16 md:mb-24"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>

        {/* 3 Sticky-Stacking Project Cards */}
        <div className="relative flex flex-col gap-12 sm:gap-16">
          {profile.projects.map((project, index) => (
            <StickyProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCards={profile.projects.length}
              onInspect={(proj) => setSelectedProject(proj)}
              onEditImages={(proj) => setEditingProject(proj)}
            />
          ))}
        </div>

        {/* Visitor Interactive Customizer Banner */}
        <div className="max-w-6xl mx-auto mt-20 p-6 sm:p-8 rounded-[32px] border border-[#D7E2EA]/25 bg-gradient-to-r from-[#18011F]/60 via-[#121316] to-[#18011F]/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#B600A8]/20 border border-[#B600A8]/40 text-[#D7E2EA] shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#BBCCD7]">
                Interactive Portfolio Generator
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#D7E2EA] mt-0.5">
                Want to see your own details on this website?
              </h3>
              <p className="text-xs sm:text-sm text-[#D7E2EA]/75 font-light mt-1 max-w-xl">
                Answer a few quick questions about your name, role, skills, and projects to
                instantly transform this entire 3D portfolio with your personal context.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isCustomVisitor && (
              <button
                type="button"
                onClick={handleResetToAaryan}
                className="rounded-full border border-[#D7E2EA]/40 px-5 py-3 text-xs uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer bg-transparent"
              >
                Reset to Aaryan
              </button>
            )}
            <button
              type="button"
              onClick={openBuilderModal}
              className="rounded-full bg-[#D7E2EA] text-[#0C0C0C] font-bold uppercase tracking-wider px-6 py-3 text-xs sm:text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer border-0"
            >
              <Wand2 className="w-4 h-4" />
              <span>Customize With My Details</span>
            </button>
          </div>
        </div>

        {/* Footer / Direct Contact Strip */}
        <div
          id="contact"
          className="max-w-6xl mx-auto mt-16 pt-12 border-t border-[#D7E2EA]/15 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-[#BBCCD7]/70 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#BBCCD7]" />
              <span>{profile.location} • {profile.Availability}</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#D7E2EA]">
              {profile.fullName}
            </h3>
            <p className="text-sm text-[#D7E2EA]/70 font-light mt-1">
              {profile.collegeOrCompany} • GitHub:{' '}
              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                @{profile.githubUsername}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="rounded-full border border-[#D7E2EA]/40 px-5 py-3 text-xs sm:text-sm uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors inline-flex items-center gap-2 cursor-pointer bg-transparent"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied {profile.email}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{profile.email}</span>
                </>
              )}
            </button>
            <ContactButton onClick={() => setIsContactOpen(true)} />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MODAL 1: VISITOR Q&A PORTFOLIO CUSTOMIZER                          */}
      {/* ================================================================== */}
      {isBuilderOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsBuilderOpen(false)}
        >
          <div
            className="bg-[#121316] border-2 border-[#D7E2EA] rounded-[32px] sm:rounded-[40px] max-w-2xl w-full p-5 sm:p-8 text-[#D7E2EA] relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#D7E2EA]/15">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B600A8] font-semibold">
                  Step {builderStep} of 4 • Interactive Portfolio Q&amp;A
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase mt-1">
                  Build Your Own Version
                </h3>
                <p className="text-xs sm:text-sm text-[#BBCCD7]/80 font-light mt-0.5">
                  Answer these quick questions and the entire website will update to your
                  personal profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                aria-label="Close portfolio builder"
                className="p-2 rounded-full border border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent text-[#D7E2EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicator Pills */}
            <div className="grid grid-cols-4 gap-2 my-5">
              {[
                { step: 1, label: '1. Identity' },
                { step: 2, label: '2. Story & Bio' },
                { step: 3, label: '3. Services' },
                { step: 4, label: '4. Projects' }
              ].map((tab) => (
                <button
                  key={tab.step}
                  type="button"
                  onClick={() => setBuilderStep(tab.step)}
                  className={`py-2 px-2 rounded-xl text-xs uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                    builderStep === tab.step
                      ? 'bg-[#D7E2EA] text-[#0C0C0C] border-[#D7E2EA]'
                      : 'bg-[#0C0C0C] text-[#D7E2EA]/70 border-[#D7E2EA]/20 hover:border-[#D7E2EA]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleApplyVisitorProfile} className="space-y-4">
              {/* STEP 1: IDENTITY & HERO */}
              {builderStep === 1 && (
                <div className="space-y-4">
                  {/* 3D Character Avatar Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-2 flex items-center justify-between">
                      <span>Choose Your 3D Character Avatar</span>
                      <span className="text-[10px] text-[#B600A8] uppercase tracking-widest font-semibold">
                        Selected: {(draftProfile.gender || 'male') === 'female' ? 'Female 3D Avatar' : 'Male 3D Avatar'}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Male 3D Avatar Card */}
                      <button
                        type="button"
                        onClick={() =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            gender: 'male',
                            portraitUrl: HERO_PORTRAIT_MALE_URL
                          }))
                        }
                        className={`group relative p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                          (draftProfile.gender || 'male') === 'male'
                            ? 'border-[#B600A8] bg-[#B600A8]/15 ring-2 ring-[#B600A8] shadow-[0_0_24px_rgba(182,0,168,0.35)]'
                            : 'border-[#D7E2EA]/20 bg-[#0C0C0C] hover:border-[#D7E2EA]/50 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl bg-black border border-[#D7E2EA]/10 overflow-hidden flex items-end justify-center mb-2.5 relative">
                          <img
                            src={HERO_PORTRAIT_MALE_URL}
                            alt="Male 3D Avatar"
                            className="w-full h-full object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
                          />
                          {(draftProfile.gender || 'male') === 'male' && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#B600A8] text-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                            Male 3D Avatar
                          </span>
                          <span className="text-[10px] text-[#BBCCD7]/60 uppercase">
                            Original
                          </span>
                        </div>
                      </button>

                      {/* Female 3D Avatar Card */}
                      <button
                        type="button"
                        onClick={() =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            gender: 'female',
                            portraitUrl: HERO_PORTRAIT_FEMALE_URL
                          }))
                        }
                        className={`group relative p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                          draftProfile.gender === 'female'
                            ? 'border-[#B600A8] bg-[#B600A8]/15 ring-2 ring-[#B600A8] shadow-[0_0_24px_rgba(182,0,168,0.35)]'
                            : 'border-[#D7E2EA]/20 bg-[#0C0C0C] hover:border-[#D7E2EA]/50 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl bg-black border border-[#D7E2EA]/10 overflow-hidden flex items-end justify-center mb-2.5 relative">
                          <img
                            src={HERO_PORTRAIT_FEMALE_URL}
                            alt="Female 3D Avatar"
                            className="w-full h-full object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
                          />
                          {draftProfile.gender === 'female' && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#B600A8] text-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                            Female 3D Avatar
                          </span>
                          <span className="text-[10px] text-[#BBCCD7]/60 uppercase">
                            New 3D
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1.5">
                      Q1. Choose a Track / Domain Preset (Auto-fills skills &amp; services)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'fullstack_ai', label: 'Full-Stack & AI Dev' },
                        { id: 'creator_3d', label: '3D & Motion Creator' },
                        { id: 'uiux_frontend', label: 'UI/UX & Frontend' }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPresetToDraft(preset.id)}
                          className={`p-3 rounded-xl border text-left text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                            selectedPreset === preset.id
                              ? 'border-[#B600A8] bg-[#B600A8]/20 text-white'
                              : 'border-[#D7E2EA]/20 bg-[#0C0C0C] text-[#D7E2EA]/80 hover:border-[#D7E2EA]/40'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        Q2. Your First Name (for &quot;Hi, i&apos;m ...&quot;)
                      </label>
                      <input
                        type="text"
                        required
                        value={draftProfile.firstName}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            firstName: e.target.value
                          }))
                        }
                        placeholder="e.g. Rohit"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        Q3. Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={draftProfile.fullName}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            fullName: e.target.value
                          }))
                        }
                        placeholder="e.g. Rohit Sharma"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        Q4. Your Role / Headline
                      </label>
                      <input
                        type="text"
                        value={draftProfile.roleTitle}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            roleTitle: e.target.value
                          }))
                        }
                        placeholder="e.g. AI Engineer & Full Stack Dev"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        Q5. College / Company
                      </label>
                      <input
                        type="text"
                        value={draftProfile.collegeOrCompany}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            collegeOrCompany: e.target.value
                          }))
                        }
                        placeholder="e.g. IIT Bombay / Google"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={draftProfile.location}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            location: e.target.value
                          }))
                        }
                        placeholder="e.g. Mumbai, India"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={draftProfile.email}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            email: e.target.value
                          }))
                        }
                        placeholder="e.g. user@gmail.com"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        value={draftProfile.githubUsername}
                        onChange={(e) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            githubUsername: e.target.value
                          }))
                        }
                        placeholder="e.g. rohit-sharma"
                        className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                      Hero Tagline (Bottom left text on hero)
                    </label>
                    <input
                      type="text"
                      value={draftProfile.heroTagline}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          heroTagline: e.target.value
                        }))
                      }
                      placeholder="e.g. an engineer driven by crafting striking and memorable software"
                      className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: STORY & BIO */}
              {builderStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs uppercase tracking-wider text-[#BBCCD7]">
                        About Me Narrative
                      </label>
                      <button
                        type="button"
                        onClick={autoGenerateAboutFromAnswers}
                        className="text-xs text-[#B600A8] font-semibold uppercase tracking-wider hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Auto-Generate from answers</span>
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={draftProfile.aboutText}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          aboutText: e.target.value
                        }))
                      }
                      placeholder="Share your story, technical journey, passions, and background..."
                      className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 p-3 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-2">
                      Key Badges &amp; Credentials (Up to 4)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[0, 1, 2, 3].map((bIdx) => (
                        <input
                          key={bIdx}
                          type="text"
                          value={draftProfile.badges[bIdx] || ''}
                          onChange={(e) => {
                            const newBadges = [...draftProfile.badges];
                            newBadges[bIdx] = e.target.value;
                            setDraftProfile((prev) => ({
                              ...prev,
                              badges: newBadges
                            }));
                          }}
                          placeholder={`Badge ${bIdx + 1} (e.g. SIH 2026 Winner)`}
                          className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-3 py-2 text-xs text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                      Availability Status
                    </label>
                    <input
                      type="text"
                      value={draftProfile.Availability}
                      onChange={(e) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          Availability: e.target.value
                        }))
                      }
                      placeholder="e.g. Open to Full-Time &amp; Freelance Roles"
                      className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: SERVICES */}
              {builderStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#BBCCD7]">
                      Customize your 5 core offerings
                    </span>
                    <span className="text-xs text-[#BBCCD7]/60">Preset: {selectedPreset}</span>
                  </div>

                  <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1">
                    {draftProfile.services.map((svc, sIdx) => (
                      <div
                        key={svc.number}
                        className="p-3.5 rounded-2xl bg-[#0C0C0C] border border-[#D7E2EA]/20 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#BBCCD7]">
                            {svc.number}
                          </span>
                          <input
                            type="text"
                            value={svc.name}
                            onChange={(e) => {
                              const updatedSvc = [...draftProfile.services];
                              updatedSvc[sIdx] = {
                                ...updatedSvc[sIdx],
                                name: e.target.value
                              };
                              setDraftProfile((prev) => ({
                                ...prev,
                                services: updatedSvc
                              }));
                            }}
                            className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 px-3 py-1.5 text-xs text-[#D7E2EA] font-semibold"
                            placeholder="Service name"
                          />
                        </div>

                        <input
                          type="text"
                          value={svc.tier}
                          onChange={(e) => {
                            const updatedSvc = [...draftProfile.services];
                            updatedSvc[sIdx] = {
                              ...updatedSvc[sIdx],
                              tier: e.target.value
                            };
                            setDraftProfile((prev) => ({
                              ...prev,
                              services: updatedSvc
                            }));
                          }}
                          className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 px-3 py-1 text-xs text-[#BBCCD7]"
                          placeholder="Tier / Category label"
                        />

                        <textarea
                          rows={2}
                          value={svc.description}
                          onChange={(e) => {
                            const updatedSvc = [...draftProfile.services];
                            updatedSvc[sIdx] = {
                              ...updatedSvc[sIdx],
                              description: e.target.value
                            };
                            setDraftProfile((prev) => ({
                              ...prev,
                              services: updatedSvc
                            }));
                          }}
                          className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 p-2 text-xs text-[#D7E2EA]/80"
                          placeholder="Short description of this service"
                        />

                        <input
                          type="text"
                          value={svc.stack}
                          onChange={(e) => {
                            const updatedSvc = [...draftProfile.services];
                            updatedSvc[sIdx] = {
                              ...updatedSvc[sIdx],
                              stack: e.target.value
                            };
                            setDraftProfile((prev) => ({
                              ...prev,
                              services: updatedSvc
                            }));
                          }}
                          className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 px-3 py-1 text-xs text-[#BBCCD7]"
                          placeholder="Tech stack (e.g. React • Node • AWS)"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: PROJECTS */}
              {builderStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#BBCCD7]">
                      Customize your 3 featured projects
                    </span>
                  </div>

                  <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1">
                    {draftProfile.projects.map((proj, pIdx) => (
                      <div
                        key={proj.id}
                        className="p-3.5 rounded-2xl bg-[#0C0C0C] border border-[#D7E2EA]/20 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#BBCCD7]">
                            {proj.number}
                          </span>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const updatedProj = [...draftProfile.projects];
                              updatedProj[pIdx] = {
                                ...updatedProj[pIdx],
                                name: e.target.value
                              };
                              setDraftProfile((prev) => ({
                                ...prev,
                                projects: updatedProj
                              }));
                            }}
                            className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 px-3 py-1.5 text-xs text-[#D7E2EA] font-semibold"
                            placeholder="Project Title"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const updatedProj = [...draftProfile.projects];
                              updatedProj[pIdx] = {
                                ...updatedProj[pIdx],
                                category: e.target.value
                              };
                              setDraftProfile((prev) => ({
                                ...prev,
                                projects: updatedProj
                              }));
                            }}
                            className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 px-3 py-1 text-xs text-[#BBCCD7]"
                            placeholder="Category"
                          />
                          <input
                            type="text"
                            value={proj.liveUrl}
                            onChange={(e) => {
                              const updatedProj = [...draftProfile.projects];
                              updatedProj[pIdx] = {
                                ...updatedProj[pIdx],
                                liveUrl: e.target.value
                              };
                              setDraftProfile((prev) => ({
                                ...prev,
                                projects: updatedProj
                              }));
                            }}
                            className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 px-3 py-1 text-xs text-[#BBCCD7]"
                            placeholder="Live Link URL"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const updatedProj = [...draftProfile.projects];
                            updatedProj[pIdx] = {
                              ...updatedProj[pIdx],
                              description: e.target.value
                            };
                            setDraftProfile((prev) => ({
                              ...prev,
                              projects: updatedProj
                            }));
                          }}
                          className="w-full rounded-lg bg-[#121316] border border-[#D7E2EA]/20 p-2 text-xs text-[#D7E2EA]/80"
                          placeholder="Project Description"
                        />

                        {/* Project Screenshots & Showcase Images Customizer */}
                        <div className="pt-2 border-t border-[#D7E2EA]/15 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="text-[11px] uppercase tracking-wider text-[#BBCCD7]/70 font-medium">
                              Media:
                            </span>
                            <div className="flex items-center gap-1">
                              <img
                                src={proj.col1Image1}
                                alt="Thumb 1"
                                className="w-6 h-6 rounded object-cover border border-[#D7E2EA]/20"
                              />
                              <img
                                src={proj.col1Image2}
                                alt="Thumb 2"
                                className="w-6 h-6 rounded object-cover border border-[#D7E2EA]/20"
                              />
                              <img
                                src={proj.col2Image}
                                alt="Main Banner"
                                className="w-8 h-6 rounded object-cover border border-[#D7E2EA]/20"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setEditingProject(proj)}
                            className="rounded-full border border-[#D7E2EA]/30 px-3 py-1 text-xs text-[#D7E2EA] hover:bg-[#D7E2EA]/10 inline-flex items-center gap-1.5 cursor-pointer bg-transparent"
                          >
                            <Camera className="w-3 h-3 text-[#BBCCD7]" />
                            <span>Change Images / Upload</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#D7E2EA]/15 gap-2">
                <div>
                  {builderStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setBuilderStep((s) => s - 1)}
                      className="rounded-full border border-[#D7E2EA]/30 px-4 py-2 text-xs uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA]/10 inline-flex items-center gap-1 cursor-pointer bg-transparent"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {builderStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setBuilderStep((s) => s + 1)}
                      className="rounded-full bg-[#D7E2EA] text-[#0C0C0C] font-semibold px-5 py-2 text-xs uppercase tracking-wider hover:opacity-90 inline-flex items-center gap-1 cursor-pointer border-0"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="rounded-full text-white font-semibold px-6 py-2.5 text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer border-0 shadow-lg"
                      style={{
                        background:
                          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'
                      }}
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply &amp; View Portfolio</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 2: PROJECT INSPECTOR / DETAIL VIEW                           */}
      {/* ================================================================== */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#121316] border-2 border-[#D7E2EA] rounded-[36px] sm:rounded-[48px] max-w-3xl w-full p-6 sm:p-10 text-[#D7E2EA] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#D7E2EA]/20">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#BBCCD7]/70 font-semibold">
                  {selectedProject.number} • {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-4xl font-black uppercase mt-1">
                  {selectedProject.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#BBCCD7]/70 font-light mt-1">
                  {selectedProject.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project modal"
                className="p-2 rounded-full border border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent text-[#D7E2EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6">
              <div className="rounded-2xl overflow-hidden border border-[#D7E2EA]/20 max-h-[360px]">
                <img
                  src={selectedProject.col2Image}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#BBCCD7] font-semibold mb-2">
                  Project Overview
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#D7E2EA]/90 font-light">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#BBCCD7] font-semibold mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-[#D7E2EA]/10 border border-[#D7E2EA]/20 text-xs text-[#D7E2EA]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#D7E2EA]/15">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#D7E2EA] text-[#0C0C0C] font-semibold uppercase tracking-wider px-6 py-3 text-xs sm:text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 no-underline"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] font-semibold uppercase tracking-wider px-6 py-3 text-xs sm:text-sm hover:bg-[#D7E2EA]/10 transition-colors inline-flex items-center gap-2 no-underline"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 3: CONTACT & INQUIRY POPUP                                   */}
      {/* ================================================================== */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="bg-[#121316] border-2 border-[#D7E2EA] rounded-[36px] sm:rounded-[48px] max-w-xl w-full p-6 sm:p-8 text-[#D7E2EA] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#D7E2EA]/15">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B600A8] font-semibold">
                  Get In Touch
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase mt-1">
                  Let&apos;s Collaborate
                </h3>
                <p className="text-xs sm:text-sm text-[#BBCCD7]/80 font-light mt-0.5">
                  Reach out directly to {profile.fullName} for projects or internships.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                aria-label="Close contact modal"
                className="p-2 rounded-full border border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent text-[#D7E2EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center gap-2 my-5">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="rounded-full border border-[#D7E2EA]/30 px-3.5 py-1.5 text-xs text-[#D7E2EA] hover:bg-[#D7E2EA]/10 inline-flex items-center gap-1.5 cursor-pointer bg-transparent"
              >
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{profile.email}</span>
              </button>

              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-[#D7E2EA]/30 px-3.5 py-1.5 text-xs text-[#D7E2EA] hover:bg-[#D7E2EA]/10 inline-flex items-center gap-1.5 no-underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Mail Client</span>
              </a>

              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#D7E2EA]/30 px-3.5 py-1.5 text-xs text-[#D7E2EA] hover:bg-[#D7E2EA]/10 inline-flex items-center gap-1.5 no-underline"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold uppercase">Message Received!</h4>
                <p className="text-sm text-[#BBCCD7] max-w-sm mx-auto font-light">
                  Thank you for reaching out. {profile.firstName} will get back to you
                  promptly at your provided email!
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="e.g. sarah@company.com"
                    className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Project Inquiry"
                    className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 px-4 py-2.5 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#BBCCD7] mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Tell me about your project, timeline, or idea..."
                    className="w-full rounded-xl bg-[#0C0C0C] border border-[#D7E2EA]/30 p-3 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full text-white font-medium uppercase tracking-widest py-3 text-xs sm:text-sm transition-transform duration-200 hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer border-0 mt-2 shadow-xl"
                  style={{
                    background:
                      'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 4: SHARE CUSTOMIZED 3D PORTFOLIO                             */}
      {/* ================================================================== */}
      {isShareOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsShareOpen(false)}
        >
          <div
            className="bg-[#121316] border-2 border-[#D7E2EA] rounded-[32px] sm:rounded-[44px] max-w-xl w-full p-5 sm:p-8 text-[#D7E2EA] relative max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D7E2EA]/15">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B600A8] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Portfolio Share Link Ready</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase mt-1">
                  Share Your Portfolio
                </h3>
                <p className="text-xs sm:text-sm text-[#BBCCD7]/80 font-light mt-0.5">
                  Your personalized 3D site is saved with a clean, short link. Send it to recruiters, friends, or share it on WhatsApp!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                aria-label="Close share modal"
                className="p-2 rounded-full border border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent text-[#D7E2EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIEW CARD */}
            <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#18011F] via-[#121316] to-[#0C0C0C] border border-[#D7E2EA]/25 relative overflow-hidden shadow-inner">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black border border-[#D7E2EA]/20 overflow-hidden flex-shrink-0 flex items-end justify-center p-1 relative">
                  <img
                    src={profile.portraitUrl || (profile.gender === 'female' ? HERO_PORTRAIT_FEMALE_URL : HERO_PORTRAIT_MALE_URL)}
                    alt={profile.fullName}
                    className="w-full h-full object-contain object-bottom"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-black/70 border border-[#D7E2EA]/20 text-[9px] text-[#BBCCD7] font-semibold uppercase">
                    3D
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#B600A8]/20 border border-[#B600A8]/40 text-[#D7E2EA] text-[10px] uppercase tracking-wider font-semibold">
                      {profile.gender === 'female' ? 'Female 3D Avatar' : 'Male 3D Avatar'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black uppercase truncate text-white">
                    Hi, i&apos;m {profile.firstName}
                  </h4>
                  <p className="text-xs text-[#BBCCD7] truncate font-medium">
                    {profile.roleTitle}
                  </p>
                  <p className="text-[11px] text-[#BBCCD7]/60 truncate font-light mt-0.5">
                    {profile.collegeOrCompany} • {profile.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Share URL Box with Copy Button */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase tracking-wider text-[#BBCCD7]">
                  Your Clean Portfolio Link
                </label>
                {isSavingShare ? (
                  <span className="text-[10px] text-[#B600A8] animate-pulse">
                    Saving to cloud ID...
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-medium">
                    ✦ Clean &amp; Short Link
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-[#0C0C0C] border border-[#D7E2EA]/30 rounded-xl p-1.5 pl-3">
                <input
                  type="text"
                  readOnly
                  value={currentShareUrl}
                  className="bg-transparent text-xs text-[#D7E2EA] w-full focus:outline-none truncate font-mono select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="rounded-lg bg-[#D7E2EA] text-[#0C0C0C] font-semibold px-3.5 py-2 text-xs uppercase tracking-wider hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-opacity"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Sharing Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* WhatsApp Share Button */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `✨ Check out my new 3D Interactive Portfolio!\n\n` +
                  `👤 ${profile.fullName} — ${profile.roleTitle}\n` +
                  `📍 ${profile.location} (${profile.collegeOrCompany})\n\n` +
                  `👉 Experience the 3D site live here:\n${currentShareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold uppercase tracking-wider px-4 py-3 text-xs inline-flex items-center justify-center gap-2 transition-all no-underline shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share on WhatsApp Group</span>
              </a>

              {/* Copy for Instagram Button */}
              <button
                type="button"
                onClick={handleCopyInstagramCaption}
                className="rounded-2xl border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-semibold uppercase tracking-wider px-4 py-3 text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {copiedInstagram ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied for Instagram!</span>
                  </>
                ) : (
                  <>
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Copy for Instagram</span>
                  </>
                )}
              </button>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#D7E2EA]/15 flex items-center justify-center text-center">
              <span className="text-xs text-[#BBCCD7]/70">
                Crafted with 3D Interactive Portfolio
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 5: PROJECT MEDIA & SCREENSHOT EDITOR                         */}
      {/* ================================================================== */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => {
            setEditingProject(null);
            setUploadingSlot(null);
          }}
        >
          <div
            className="bg-[#121316] border-2 border-[#D7E2EA] rounded-[32px] sm:rounded-[44px] max-w-3xl w-full p-5 sm:p-8 text-[#D7E2EA] relative max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#D7E2EA]/15">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B600A8] font-semibold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Customize Project Media • {editingProject.number}</span>
                </span>
                <h3 className="text-xl sm:text-3xl font-black uppercase mt-1">
                  {editingProject.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#BBCCD7]/80 font-light mt-0.5">
                  Upload custom screenshots from your computer or paste image links. Changes are automatically optimized and saved to your custom share link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setUploadingSlot(null);
                }}
                aria-label="Close image editor modal"
                className="p-2 rounded-full border border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent text-[#D7E2EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slots List */}
            <div className="py-6 space-y-5">
              {([
                {
                  key: 'col1Image1' as const,
                  title: 'Slot 1: Top Thumbnail Preview'
                },
                {
                  key: 'col1Image2' as const,
                  title: 'Slot 2: Bottom Thumbnail Preview'
                },
                {
                  key: 'col2Image' as const,
                  title: 'Slot 3: Main Featured Showcase Banner'
                }
              ]).map((slotInfo) => {
                const currentUrl = editingProject[slotInfo.key];
                const defaultProj = DEFAULT_PROJECTS_DATA.find((p) => p.id === editingProject.id);
                const defaultUrl = defaultProj ? defaultProj[slotInfo.key] : '';
                const isUploading = uploadingSlot === slotInfo.key;

                return (
                  <div
                    key={slotInfo.key}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0C0C0C] border border-[#D7E2EA]/20 space-y-4"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#BBCCD7]">
                        {slotInfo.title}
                      </span>
                      {defaultUrl && currentUrl !== defaultUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject((prev) =>
                              prev ? { ...prev, [slotInfo.key]: defaultUrl } : null
                            );
                          }}
                          className="text-[11px] uppercase tracking-wider text-[#BBCCD7]/70 hover:text-[#D7E2EA] inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Reset to Default</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Live Preview Thumbnail */}
                      <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-[#D7E2EA]/20 bg-black h-36 flex items-center justify-center">
                        {currentUrl ? (
                          <img
                            src={currentUrl}
                            alt={slotInfo.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-8 text-center text-xs text-[#BBCCD7]/50">
                            No Image Set
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center gap-2 text-xs font-semibold text-white">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Compressing...</span>
                          </div>
                        )}
                      </div>

                      {/* Upload & URL Controls */}
                      <div className="md:col-span-7 space-y-3">
                        {/* File Upload Button */}
                        <div>
                          <label className="w-full rounded-xl border border-dashed border-[#D7E2EA]/40 bg-[#121316] hover:bg-[#D7E2EA]/10 px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors group">
                            <Upload className="w-4 h-4 text-[#BBCCD7] group-hover:text-white" />
                            <span className="text-xs uppercase tracking-wider font-semibold text-[#D7E2EA]">
                              Upload File From Device
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingSlot(slotInfo.key);
                                try {
                                  const compressed = await compressImageFile(file, 1200, 750, 0.82);
                                  setEditingProject((prev) =>
                                    prev ? { ...prev, [slotInfo.key]: compressed } : null
                                  );
                                } catch (err) {
                                  console.error('Error compressing image:', err);
                                } finally {
                                  setUploadingSlot(null);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Or Paste URL */}
                        <div>
                          <span className="block text-[11px] uppercase tracking-wider text-[#BBCCD7]/60 mb-1">
                            Or Paste Direct Image URL:
                          </span>
                          <input
                            type="text"
                            value={currentUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingProject((prev) =>
                                prev ? { ...prev, [slotInfo.key]: val } : null
                              );
                            }}
                            placeholder="https://example.com/screenshot.png"
                            className="w-full rounded-xl bg-[#121316] border border-[#D7E2EA]/20 px-3.5 py-2 text-xs text-[#D7E2EA] font-mono focus:outline-none focus:border-[#D7E2EA]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#D7E2EA]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const defaultProj = DEFAULT_PROJECTS_DATA.find((p) => p.id === editingProject.id);
                  if (defaultProj) {
                    setEditingProject({
                      ...editingProject,
                      col1Image1: defaultProj.col1Image1,
                      col1Image2: defaultProj.col1Image2,
                      col2Image: defaultProj.col2Image
                    });
                  }
                }}
                className="text-xs uppercase tracking-wider text-[#BBCCD7]/70 hover:text-white inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reset All 3 Images to Default</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setUploadingSlot(null);
                  }}
                  className="rounded-full border border-[#D7E2EA]/30 px-5 py-2.5 text-xs uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProjectMedia(editingProject)}
                  className="rounded-full text-white font-semibold px-6 py-2.5 text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer border-0 shadow-lg"
                  style={{
                    background:
                      'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'
                  }}
                >
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Apply Images</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
