"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import useThemeStore from "@/store/themeStore";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useSpring } from "framer-motion";

// Animation variants with improved easing
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  },
};

// Optimized and memoized particle component
const ParticleBackground = memo(() => {
  // Add client-side only rendering for particles
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // Generate particles only on client-side
  useEffect(() => {
    setIsClient(true);
    
    // Create deterministic particles array
    const newParticles = Array(8).fill(0).map((_, i) => ({
      id: i,
      opacity: 0.15 + (i / 8) * 0.2,
      scale: 0.2 + (i / 8) * 0.5,
      x: `${(i * 12) % 100}%`,
      y: `${(i * 15) % 100}%`,
      width: `${4 + (i % 10)}px`,
      height: `${4 + (i % 10)}px`,
      duration: 25 + i * 2,
      xEnd: `${((i * 15) + 50) % 100}%`,
      yEnd: `${((i * 12) + 50) % 100}%`,
    }));
    
    setParticles(newParticles);
  }, []);
  
  if (!isClient) return null; // Return null during SSR
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary/60 dark:bg-dark-primary/50 rounded-full will-change-transform"
          initial={{
            opacity: particle.opacity,
            scale: particle.scale,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            opacity: [particle.opacity, particle.opacity + 0.15, particle.opacity],
            y: [particle.y, particle.yEnd],
            x: [particle.x, particle.xEnd],
          }}
          transition={{
            duration: particle.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            width: particle.width,
            height: particle.height,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
});

ParticleBackground.displayName = "ParticleBackground";

// Enhanced ExploreCard with better hover mechanics
const ExploreCard = memo(({ title, description, image }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      // className="bg-white dark:bg-dark-cardBg p-6 rounded-xl shadow-lg hover:shadow-xl flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300"
      className="bg-white dark:bg-dark-cardBg p-4 sm:p-6 rounded-xl shadow-md sm:shadow-lg hover:shadow-xl flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300 w-full"
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ willChange: "transform" }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      <motion.div
        animate={isHovered ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mb-2"
        style={{ willChange: "transform" }}
      >
        <Image 
          src={image} 
          alt={title} 
          width={64} 
          height={64} 
          priority 
          className="drop-shadow-lg" 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold mt-3 text-primary dark:text-dark-primary relative z-10">{title}</h3>
      <p className="text-text dark:text-dark-text mt-2 text-sm relative z-10 leading-relaxed">{description}</p>
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/80 via-accent to-primary/80"
        initial={{ scaleX: 0, originX: 0 }}
        animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ willChange: "transform" }}
      />
    </motion.div>
  );
});

ExploreCard.displayName = "ExploreCard";

// Enhanced ServiceCard Component with improved animations
const ServiceCard = memo(({ title, description, icon }) => {
  return (
    <motion.div
      className="bg-white dark:bg-dark-cardBg p-6 rounded-xl shadow-md hover:shadow-xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300"
      whileHover={{ 
        scale: 1.02,
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }}
      style={{ willChange: "transform" }}
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-accent" />
      
      <motion.div
        whileHover={{ 
          rotate: [0, -3, 3, -2, 2, 0], 
          transition: { duration: 0.5, ease: "easeInOut" } 
        }}
        className="relative z-10 mb-2"
        style={{ willChange: "transform" }}
      >
        <Image src={icon} alt={title} width={56} height={56} priority className="drop-shadow-md" />
      </motion.div>
      
      <h3 className="text-xl font-semibold mt-3 text-accent dark:text-dark-accent">{title}</h3>
      <p className="text-text dark:text-dark-text mt-2 text-sm leading-relaxed">{description}</p>
      
      <motion.div
        className="w-12 h-0.5 bg-accent mt-4"
        whileHover={{ width: "60%", transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
        style={{ willChange: "transform" }}
      />
    </motion.div>
  );
});

ServiceCard.displayName = "ServiceCard";

// Testimonials Data
const testimonials = [
  {
    quote: "Casting Hub helped me land my first major role in a commercial. The process was seamless, and the opportunities are endless!",
    name: "Alex Johnson",
    role: "Actor",
    avatar: "/avatars/avatar1.png"
  },
  {
    quote: "I found multiple gigs through this platform. Highly recommend for anyone serious about their career!",
    name: "Sarah Williams",
    role: "Model",
    avatar: "/avatars/avatar2.png"
  },
  {
    quote: "A fantastic platform that connects talented individuals with great opportunities. I got cast in a major project!",
    name: "Michael Lee",
    role: "Voice Actor",
    avatar: "/avatars/avatar3.png"
  },
];

// Hero button component
const ActionButton = memo(({ href, primary = false, children }) => {
  return (
    <motion.div
      className="w-full sm:w-auto"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: "transform" }}
    >
      <Link
        href={href}
        className={`w-full sm:w-auto px-8 py-4 ${
          primary
            ? "bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/30"
            : "bg-white dark:bg-dark-cardBg text-primary dark:text-dark-primary border border-primary dark:border-dark-primary hover:bg-primary/10 dark:hover:bg-dark-primary/10"
        } rounded-lg text-center transition-all block`}
      >
        {children}
      </Link>
    </motion.div>
  );
});

ActionButton.displayName = "ActionButton";

// Section title component
const SectionTitle = memo(({ children, className = "" }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent dark:from-dark-primary dark:to-dark-accent ${className}`}
    >
      {children}
    </motion.h2>
  );
});

SectionTitle.displayName = "SectionTitle";

// Testimonial Card component
const TestimonialCard = memo(({ quote, name, role, avatar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 py-8 bg-white dark:bg-dark-cardBg rounded-xl shadow-lg"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-primary dark:text-dark-primary text-4xl mb-4 opacity-70"
      >
        &quot;
      </motion.div>
      <motion.blockquote 
        className="text-lg md:text-xl italic text-black dark:text-white mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {quote}
      </motion.blockquote>
      <motion.footer 
        className="mt-4 text-sm text-gray-600 dark:text-dark-text flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="w-10 h-0.5 bg-gradient-to-r from-primary to-accent mb-3" />
        <strong className="text-primary dark:text-dark-primary">
          {name}
        </strong>
        <span className="text-xs mt-1">{role}</span>
      </motion.footer>
    </motion.div>
  );
});

TestimonialCard.displayName = "TestimonialCard";

export default function Home() {
  // Use useState with proper initialization for client/server rendering
  const [isClient, setIsClient] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef(null);
  const { darkMode } = useThemeStore();
  
  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    setHasMounted(true);
  }, []);
  
  // Performance-optimized scroll animations - only on client
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
    mass: 1,
  });

  // Smoother parallax effects with optimized values
  const backgroundY = useTransform(smoothScroll, [0, 0.5], ["0%", "40%"]);
  const opacity = useTransform(smoothScroll, [0, 0.3], [1, 0]);
 
  // Memoized function for changing testimonials
  const handleTestimonialChange = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Auto-cycling testimonials with useEffect cleanup - only on client
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isClient]);

  // Fix for hydration mismatch - delay rendering until client-side
  if (!hasMounted) {
    return null; // Return null on initial server render
  }

  return (
    <div className={`min-h-screen bg-neutral dark:bg-darkBg ${darkMode ? "dark" : ""} overflow-hidden`}>
      {/* Only render ParticleBackground on client-side */}
      {isClient && <ParticleBackground />}
      
      {/* Hero Section with Enhanced Animations */}
      <motion.section
        id="home"
        ref={heroRef}
        className="relative flex flex-col items-center text-center pt-28 md:pt-36 px-6 overflow-hidden min-h-[90vh] md:min-h-[85vh] justify-center"
      >
        {/* Animated Background Shape - Client-side only */}
        {isClient && (
          <motion.div 
            className="absolute -z-10 w-full max-w-6xl h-64 md:h-96 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 blur-3xl"
            animate={{ 
              scale: [1, 1.03, 1],
              rotate: [0, 1, 0],
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{ y: backgroundY, willChange: "transform" }}
          />
        )}
        
        {isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ opacity }}
            className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"
          />
        )}
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-tight md:leading-snug"
          style={{ willChange: "transform, opacity" }}
        >
          Discover Your Next Star: <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent dark:from-dark-primary dark:to-dark-accent">
            Unleash Your Talent
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-text dark:text-dark-text mt-6 max-w-2xl text-lg md:text-xl"
          style={{ willChange: "transform, opacity" }}
        >
          Join us to find the perfect talent for your next production project today!
        </motion.p>

        {/* Enhanced Buttons with Smoother Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-6"
          style={{ willChange: "transform, opacity" }}
        >
          <ActionButton href="/#explore" primary>Explore</ActionButton>
          <ActionButton href="/signup">Sign Up</ActionButton>
        </motion.div>
        
    {/* Smoother Animated Scroll Indicator - Only on client */}
{/* {isClient && (
  <motion.div 
    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-10" 
    initial={{ opacity: 0 }}
    animate={{ 
      y: [0, 8, 0],
      opacity: 1 
    }}
    transition={{ 
      y: {
        duration: 2.5, 
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      },
      opacity: { duration: 0.8 }
    }}
    aria-hidden="true"
    style={{ willChange: "transform" }}
  >
    <svg 
      width="30" 
      height="30" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-primary dark:text-dark-primary hover:text-accent dark:hover:text-dark-accent transition-colors duration-300"
      aria-label="Scroll down indicator"
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </motion.div>
)} */}
</motion.section>

{/* Image Section with Enhanced Animation */}
<motion.section
  initial={{ opacity: 0, scale: 0.98 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true, margin: "-100px", amount: 0.3 }}
  className="mt-8 md:mt-0 px-6 flex justify-center"
  style={{ willChange: "transform, opacity" }}
  id="showcase"
>
  <motion.div 
    className="max-w-4xl w-full rounded-xl overflow-hidden shadow-xl relative group"
    whileHover={{ 
      scale: 1.02,
      transition: { duration: 0.4, ease: "easeOut" }
    }}
    style={{ willChange: "transform" }}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent z-10 rounded-xl group-hover:opacity-80 transition-opacity duration-300" />
    <Image
      src="/background.jpg"
      alt="Casting Talent"
      width={1200}
      height={600}
      className="w-full h-auto object-cover"
      priority
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzlkYzFmZiIvPjwvc3ZnPg=="
    />
    
    {/* Enhanced Floating Elements with Performance Optimizations */}
    <motion.div 
      className="absolute top-4 right-4 w-16 h-16 rounded-full bg-accent/30 backdrop-blur-md z-20 shadow-lg"
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 5, 0],
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut" 
      }}
      style={{ willChange: "transform" }}
    />
    <motion.div 
      className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-primary/30 backdrop-blur-md z-20 shadow-lg"
      animate={{ 
        y: [0, 8, 0],
        rotate: [0, -5, 0],
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: 1 
      }}
      style={{ willChange: "transform" }}
    />
    
    {/* New: Subtle caption overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      {/* <p className="text-white text-lg font-medium">Discover exceptional talent for your next production</p> */}
    </div>
  </motion.div>
</motion.section>
      {/* Enhanced Explore Section */}
<motion.section
  id="explore"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2, margin: "-100px" }}
  variants={containerVariants}
  className="py-12 px-6 text-center bg-white dark:bg-darkBg mt-16 relative overflow-visible"
>
  {/* Background decorative elements - optimized */}
  <div className="absolute inset-0 overflow-visible">
    <motion.div 
      className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/5 dark:bg-primary/10" 
      animate={{ 
        scale: [1, 1.05, 1],
        x: [0, 10, 0],
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        repeatType: "reverse",
        ease: "easeInOut" 
      }}
      style={{ willChange: "transform" }}
    />
  </div>

  <SectionTitle>Explore Opportunities</SectionTitle>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    viewport={{ once: true }}
    className="text-text dark:text-dark-text mt-4 max-w-3xl mx-auto"
  >
    Browse through different categories and find the perfect opportunity for your talent.
  </motion.p>

  <motion.div
    className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
    variants={containerVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >
    {[
      {
        title: "Acting Roles",
        description: "Find auditions for TV, film, and theater.",
        image: "/explore_icons/actor.png",
      },
      {
        title: "Modeling Jobs",
        description: "Get discovered by top brands and agencies.",
        image: "/explore_icons/model.png",
      },
      {
        title: "Voice Acting",
        description: "Showcase your voice talent for commercials & animation.",
        image: "/explore_icons/voice.png",
      },
      {
        title: "Extras & Crew",
        description: "Join productions as an extra or crew member.",
        image: "/explore_icons/crew.png",
      },
    ].map((item, index) => (
      <motion.div key={index} variants={cardVariants}>
        <ExploreCard {...item} />
      </motion.div>
    ))}
  </motion.div>
</motion.section>

      {/* Enhanced About Us Section */}
      <section id="about-us" className="py-20 bg-neutral dark:bg-darkBg text-text dark:text-darkText relative overflow-hidden">
        {/* Decorative background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50"
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <SectionTitle>About Us</SectionTitle>

          {/* Section Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.3 }}
            variants={{
              hidden: {},
              visible: {},
            }}
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Enhanced Image with Animation */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95, x: -30 },
                visible: { opacity: 1, scale: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="overflow-hidden rounded-xl shadow-lg group"
              whileHover={{ scale: 1.01, y: -5 }}
            >
              <motion.div className="relative">
                <Image
                  src="/about.jpg"
                  alt="Casting Process"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  width={600}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.div>

            {/* Right: Enhanced Text Content */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="h-1 bg-gradient-to-r from-primary to-accent mb-6"
              />
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold text-accent dark:text-white"
              >
                Connecting Talent with Opportunity
              </motion.h3>
              <p className="mt-4 text-lg leading-relaxed">
                We are a leading casting platform that helps talented individuals connect with top casting directors,
                agencies, and production houses. Our mission is to provide artists with the right opportunities to
                showcase their talent and build successful careers.
              </p>
              <p className="mt-4 text-lg leading-relaxed">
                Whether you&apos;re an aspiring actor, model, or voice-over artist, we ensure your skills get the
                attention they deserve.
              </p>
              
              {/* Animated stat counter */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { value: "500+", label: "Productions" },
                  { value: "10K+", label: "Talents" },
                  { value: "98%", label: "Success Rate" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <motion.p 
                      className="text-2xl font-bold text-primary dark:text-dark-primary"
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: [0.9, 1.1, 1] }}
                      transition={{ delay: 0.6 + (index * 0.15), duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-text dark:text-dark-text">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Services Section */}
<motion.section
  id="services"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  viewport={{ once: true }}
  className="py-20 px-6 text-center bg-white dark:bg-darkBg relative overflow-hidden"
>
  {/* Decorative Background Elements */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-primary dark:bg-dark-primary rounded-full"
        initial={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          scale: Math.random() * 0.4 + 0.3,
        }}
        animate={{
          x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
        }}
        transition={{
          duration: Math.random() * 20 + 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          width: `${Math.random() * 180 + 40}px`,
          height: `${Math.random() * 180 + 40}px`,
          opacity: 0.05,
        }}
      />
    ))}
  </div>

  <div className="relative z-10">
    <SectionTitle>Our Services</SectionTitle>

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      className="text-text dark:text-dark-text mt-4 max-w-3xl mx-auto"
    >
      Explore our professional casting services designed to connect talent with opportunities.
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.2 }}
      variants={{
        hidden: {},
        visible: {},
      }}
      viewport={{ once: true }}
      className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {[
        {
          title: "Casting Calls",
          description: "Find the latest casting calls and apply with ease.",
          icon: "/services_icons/casting-call.png",
        },
        {
          title: "Talent Management",
          description: "Manage your profile, showcase your talent, and get noticed.",
          icon: "/services_icons/talent-management.png",
        },
        {
          title: "Production Support",
          description: "Connect with filmmakers and production houses for collaborations.",
          icon: "/services_icons/production.png",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          <ServiceCard {...item} />
        </motion.div>
      ))}
    </motion.div>
  </div>
</motion.section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 px-6 text-center bg-neutral dark:bg-darkBg relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 overflow-hidden">
          <motion.div 
            className="w-96 h-96 rounded-full border-4 border-primary dark:border-dark-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-64 h-64 rounded-full border-2 border-accent dark:border-dark-accent"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5B408C] to-[#8E3F67]"
          >
            What Our Users Say
          </motion.h2>

          <div className="mt-12 max-w-4xl mx-auto relative overflow-hidden min-h-44">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="w-full px-6 py-8 bg-white dark:bg-dark-cardBg rounded-lg shadow-lg"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-primary dark:text-dark-primary text-4xl mb-4"
                >
                  &quot;
                </motion.div>
                <motion.blockquote 
                  className="text-lg md:text-xl italic text-black dark:text-white mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {testimonials[currentIndex].quote}
                </motion.blockquote>
                <motion.footer 
                  className="mt-4 text-sm text-gray-600 dark:text-dark-text flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <div className="w-10 h-1 bg-gradient-to-r from-primary to-accent mb-3" />
                  <strong className="text-primary dark:text-dark-primary">
                    {testimonials[currentIndex].name}
                  </strong>
                  <span className="text-xs mt-1">{testimonials[currentIndex].role}</span>
                </motion.footer>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-gradient-to-r from-primary to-accent text-white text-center relative overflow-hidden"
      >
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Take the Spotlight?
          </h2>
          <p className="mt-4 text-lg">
            Sign up now and connect with casting professionals, directors, and producers. Your next big break starts here.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Decorative Blur Element */}
        {/* <motion.div 
          className="absolute -bottom-20 left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        />
         */}
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}


















































