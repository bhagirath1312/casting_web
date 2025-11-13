"use client";
import { useState, useEffect } from "react";
// import Navbar from "@/components/navbar"; // Assuming this is handled elsewhere
// import Footer from "@/components/footer"; // We will use a custom AestheticFooter
import Image from "next/image";
import Link from "next/link";
import useThemeStore from "@/store/themeStore";
import { motion } from "framer-motion";

// --- Aesthetic Palette & Design System (Updated for Golden Logo Theme) ---
// Primary Accent Color: Gold/Saffron (amber-500/600 for contrast)
// Background: Deep Charcoal/Dark Slate (gray-900/gray-950)
// Text: White / Light Gray

// Custom Golden Color Class Names:
const GOLD_PRIMARY = "text-amber-500 dark:text-amber-400";
const GOLD_BG_PRIMARY = "bg-amber-600 hover:bg-amber-700";
const CONTRAST_BUTTON = "text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white";

// Variants for sequential section loading
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ✅ ExploreCard Component (Updated Aesthetic for Gold)
const ExploreCard = ({ title, description, image }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
    whileHover={{ y: -5 }} // Subtle lift on hover
  >
    <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded-full">
      <Image src={image} alt={title} width={48} height={48} priority className="w-12 h-12" />
    </div>
    <h3 className="text-xl font-bold mt-6 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mt-3 text-base">{description}</p>
  </motion.div>
);

// ✅ ServiceCard Component (Updated Aesthetic for Gold)
const ServiceCard = ({ title, description, icon }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border-t-4 border-amber-500 shadow-lg flex flex-col items-start text-left transition-all duration-300 hover:shadow-2xl hover:bg-white dark:hover:bg-gray-700"
  >
    <div className="p-3 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
      <Image src={icon} alt={title} width={36} height={36} priority className="w-9 h-9" />
    </div>
    <h3 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mt-3 text-base">{description}</p>
  </motion.div>
);

// ✅ Testimonials Data
const testimonials = [
  {
    quote: "Casting Hub helped me land my first major role in a commercial. The process was seamless, and the opportunities are endless!",
    name: "Alex Johnson",
    role: "Actor",
  },
  {
    quote: "I found multiple gigs through this platform. Highly recommend for anyone serious about their career!",
    name: "Sarah Williams",
    role: "Model",
  },
  {
    quote: "A fantastic platform that connects talented individuals with great opportunities. I got cast in a major project!",
    name: "Michael Lee",
    role: "Voice Actor",
  },
];

// 🆕 Aesthetic Footer Component (Matches new Gold theme)
const AestheticFooter = () => (
    <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 border-t border-gray-700 dark:border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1: Logo & Mission */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4">Casting Hub</h4>
          <p className="text-sm">
            Connecting talent with top production opportunities worldwide.
          </p>
        </div>
  
        {/* Column 2: Quick Links */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#explore" className="hover:text-amber-400 transition-colors">Explore</Link></li>
            <li><Link href="/#services" className="hover:text-amber-400 transition-colors">Services</Link></li>
            <li><Link href="/#about-us" className="hover:text-amber-400 transition-colors">About Us</Link></li>
          </ul>
        </div>
  
        {/* Column 3: Resources */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Resources</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/signup" className="hover:text-amber-400 transition-colors">Sign Up</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
          </ul>
        </div>
  
        {/* Column 4: Contact */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Get in Touch</h5>
          <p className="text-sm">Email: support@castinghub.com</p>
          <p className="text-sm mt-2">
            <a href="#" className="text-amber-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
  
      <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
        &copy; {new Date().getFullYear()} Casting Hub. All rights reserved.
      </div>
    </footer>
  );

export default function Home() {
  const { darkMode } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // ✅ Automatic Testimonials Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setFade(false);
      }, 500);
    }, 5000); // Slower rotation for aesthetic appeal
    return () => clearInterval(interval);
  }, []);

  // --- Dark Mode Class Application ---
  const themeClass = darkMode ? "dark" : "";

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${themeClass} font-sans transition-colors duration-500`}>
      
      {/* ✅ Hero Section with Modern, Bold Typography (GOLD ACCENTS) */}
      <section id="home" className="pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-50 dark:from-gray-800 to-transparent opacity-50 dark:opacity-20"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight"
          >
            Discover Your Next Star: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-700">
              Unleash Your Talent
            </span>{" "}
            with Our Casting Services
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto"
          >
            Join us to find the perfect talent for your next production project today!
          </motion.p>

          {/* Buttons: Primary & Secondary Styles (GOLD ACCENTS) */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row justify-center w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              href="/#explore"
              className={`px-10 py-4 ${GOLD_BG_PRIMARY} text-white font-semibold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              Explore Opportunities
            </Link>

            <Link
              href="/signup"
              className={`px-10 py-4 bg-white dark:bg-gray-800 ${CONTRAST_BUTTON} border font-semibold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              Sign Up Now
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ✅ Image Section with Framed Presentation */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-12 mb-20 px-6 flex justify-center"
      >
        <div className="max-w-6xl rounded-3xl overflow-hidden shadow-2xl dark:shadow-amber-500/20 border-8 border-white dark:border-gray-800">
          <Image
            src="/background.jpg"
            alt="Casting Talent"
            width={1200}
            height={600}
            layout="responsive"
            className="object-cover w-full h-full"
          />
        </div>
      </motion.section>

      {/* ✅ Explore Section (Grid with Elegant Cards) */}
      <section id="explore" className="py-24 px-6 text-center bg-gray-100 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Explore Opportunities</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
          Browse through different categories and find the perfect opportunity for your talent.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid md:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {[
            { title: "Acting Roles", description: "Find auditions for TV, film, and theater.", image: "/explore_icons/actor.png" },
            { title: "Modeling Jobs", description: "Get discovered by top brands and agencies.", image: "/explore_icons/model.png" },
            { title: "Voice Acting", description: "Showcase your voice talent for commercials & animation.", image: "/explore_icons/voice.png" },
            { title: "Extras & Crew", description: "Join productions as an extra or crew member.", image: "/explore_icons/crew.png" },
          ].map((item, index) => (
            <ExploreCard key={index} {...item} />
          ))}
        </motion.div>
      </section>

      {/* ✅ About Us Section (Unique UI: Two-Panel Card with 3D Tilt Effect and Color Text - GOLD ACCENTS) */}
      <section id="about-us" className="py-24 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Section Content Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.0, type: "spring", stiffness: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl dark:shadow-amber-500/30"
          >
            {/* Left Panel: Image (Visual Focus) */}
  <div className="md:w-1/2 bg-amber-600 dark:bg-amber-600 p-1.5 flex items-center justify-center">
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}         // Starts slightly zoomed out
    whileInView={{ scale: 1, opacity: 1 }}       // Zooms in when scrolled into view
    transition={{
      duration: 0.8,
      ease: "easeInOut",
      type: "spring",
      stiffness: 120,
      damping: 12,
    }}
    viewport={{ once: true }}
    className="w-full h-full overflow-hidden rounded-2xl shadow-xl"
  >
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}          // Breathing animation (slow zoom-in/zoom-out loop)
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="w-full h-full"
    >
      <Image
        src="/about.jpg"
        alt="Casting Process"
        className="w-full h-full object-cover"
        width={1080}
        height={1080}
      />
    </motion.div>
  </motion.div>
</div>


            {/* Right Panel: Text Content (Brand Colors & Tight Layout) */}
            <div className="md:w-1/2 p-8 md:p-12 bg-white dark:bg-gray-800 flex flex-col justify-center">
              <span className={`text-sm font-bold uppercase ${GOLD_PRIMARY} tracking-widest border-b-2 border-amber-400 pb-1 w-fit`}>
                Our Mission
              </span>
              <h2 className="text-3xl font-extrabold mt-4 text-gray-900 dark:text-white leading-tight">
                <span className="text-amber-600 dark:text-amber-400">Connecting Talent</span> with Opportunity
              </h2>
              <p className="mt-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                We are a leading casting platform that helps talented individuals connect with top casting directors, agencies, and production houses.
                Our mission is to provide artists with the right opportunities to showcase their talent and build successful careers.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Whether you&apos;re an aspiring actor, model, or voice-over artist, we ensure your skills get the attention they deserve.
              </p>
              <Link
                href="/about"
               className={`
    mt-8 self-start inline-block px-8 py-3 text-lg font-bold rounded-full 
    bg-amber-600 dark:bg-amber-500 text-white 
    shadow-[0_8px_15px_rgba(234,179,8,0.4)] dark:shadow-[0_8px_15px_rgba(251,191,36,0.3)]
    transition-all duration-300 ease-in-out
    transform 
    hover:scale-[1.05] hover:shadow-[0_12px_20px_rgba(234,179,8,0.6)] 
    active:translate-y-0.5 active:shadow-[0_4px_10px_rgba(234,179,8,0.4)]
  `}
              >
                Find Out More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ Services Section (Focus on Card Design - GOLD ACCENTS) */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900" id="services">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            Explore our professional casting services designed to connect talent with opportunities.
          </p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.3 }}
           className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 md:px-8 animate-[fadeUp_1s_ease-in-out] [perspective:1000px] [&>*:hover]:[transform:translateY(-6px)_scale(1.03)] [&>*:hover]:shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all duration-500"

          >
            <ServiceCard
              title="Casting Calls"
              description="Find the latest casting calls and apply with ease."
              icon="/services_icons/casting-call.png"
            />
            <ServiceCard
              title="Talent Management"
              description="Manage your profile, showcase your talent, and get noticed."
              icon="/services_icons/talent-management.png"
            />
            <ServiceCard
              title="Production Support"
              description="Connect with filmmakers and production houses for collaborations."
              icon="/services_icons/production.png"
            />
          </motion.div>
        </div>
      </section>

      {/* ✅ Testimonials Section (Clean & Focused - GOLD ACCENTS) */}
      <section className="py-20 px-6 text-center bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
        <div className="mt-10 max-w-4xl mx-auto h-40 relative overflow-hidden flex items-center justify-center">
          <motion.div
            key={currentIndex} // Key change triggers the motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="absolute w-full px-4"
          >
            <blockquote className="text-1.5xl italic font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
              &quot;{testimonials[currentIndex].quote}&quot;
            </blockquote>
            <p className="mt-6 text-lg font-semibold text-amber-600 dark:text-amber-400">
              - {testimonials[currentIndex].name}, <span className="text-gray-500 dark:text-gray-400 font-normal">{testimonials[currentIndex].role}</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ✅ Call to Action Section (Vibrant Gradient - GOLD ACCENTS) */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-amber-600 to-yellow-700 text-white rounded-xl shadow-2xl mx-4 md:mx-16 my-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold">Ready to Get Started?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl leading-relaxed opacity-90">
            Take the next step in your career and join a thriving community of talent.
          </p>
          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-white text-amber-600 font-bold text-xl rounded-full shadow-xl hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              Sign Up Now
            </Link>
          </div>
        </motion.div>
      </section>
      <AestheticFooter />
    </div>
  );
}