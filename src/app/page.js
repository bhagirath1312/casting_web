// "use client";
// import { useState, useEffect } from "react";
// import Footer from "@/components/footer";
// import Image from "next/image";
// import Link from "next/link";
// import useThemeStore from "@/store/themeStore"; // Import Zustand for dark mode
// import { AnimatePresence, motion } from "framer-motion";


// // ✅ ExploreCard Component
// const ExploreCard = ({ title, description, image }) => (
//   <div className="bg-neutral dark:bg-dark-cardBg p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg">
//     <Image src={image} alt={title} width={64} height={64} priority />
//     <h3 className="text-xl font-semibold mt-4 text-primary dark:text-dark-primary">{title}</h3>
//     <p className="text-text dark:text-dark-text mt-2 text-sm">{description}</p>
//   </div>
// );

// // ✅ ServiceCard Component
// const ServiceCard = ({ title, description, icon }) => (
//   <div className="bg-white dark:bg-dark-cardBg p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg">
//     <Image src={icon} alt={title} width={64} height={64} priority />
//     <h3 className="text-xl font-semibold mt-4 text-accent dark:text-dark-accent">{title}</h3>
//     <p className="text-text dark:text-dark-text mt-2 text-sm">{description}</p>
//   </div>
// );

// // ✅ Testimonials Data
// const testimonials = [
//   {
//     quote: "Casting Hub helped me land my first major role in a commercial. The process was seamless, and the opportunities are endless!",
//     name: "Alex Johnson",
//     role: "Actor",
//   },
//   {
//     quote: "I found multiple gigs through this platform. Highly recommend for anyone serious about their career!",
//     name: "Sarah Williams",
//     role: "Model",
//   },
//   {
//     quote: "A fantastic platform that connects talented individuals with great opportunities. I got cast in a major project!",
//     name: "Michael Lee",
//     role: "Voice Actor",
//   },
// ];

// export default function Home() {
//   const { darkMode } = useThemeStore(); // Zustand for dark mode
//   const [currentIndex, setCurrentIndex] = useState(0);
//   // const [fade, setFade] = useState(false);

  
//   // ✅ Automatic Testimonials Rotation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % testimonials.length);
//     }, 5000); // 5 seconds per slide
//     return () => clearInterval(interval);
//   }, []);


//   return (
//     <div className={`min-h-screen bg-neutral dark:bg-darkBg ${darkMode ? "dark" : ""}`}>
    

//       {/* ✅ Hero Section with Animations */}
//       <motion.section
//         id="home"
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="flex flex-col items-center text-center pt-28 md:pt-36 px-6"
//       >
//         <motion.h1
//           initial={{ opacity: 0, y: -30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="text-4xl md:text-5xl font-bold text-black dark:text-white leading-snug"
//         >
//           Discover Your Next Star: <br />
//           <span className="text-primary dark:text-dark-primary">Unleash Your Talent</span> with Our Casting Services
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.2 }}
//           viewport={{ once: true }}
//           className="text-text dark:text-dark-text mt-4 max-w-2xl"
//         >
//           Join us to find the perfect talent for your next production project today!
//         </motion.p>

//         {/* Buttons with Proper Mobile Spacing */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.4 }}
//           viewport={{ once: true }}
//           className="mt-6 flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4"
//         >
//           <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
//             <Link
//               href="/#explore"
//               className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg text-center hover:bg-dark-primary transition-transform block"
//             >
//               Explore
//             </Link>
//           </motion.div>

//           <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
//             <Link
//               href="/signup"
//               className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-dark-cardBg text-primary border border-primary rounded-lg text-center hover:bg-primary hover:text-white transition-transform block"
//             >
//               Sign Up
//             </Link>
//           </motion.div>
//         </motion.div>
//       </motion.section>

//       {/* ✅ Image Section with Fade-In Effect */}
//       <motion.section
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 1 }}
//         viewport={{ once: true }}
//         className="mt-12 px-6 flex justify-center"
//       >
//         <div className="max-w-4xl rounded-lg overflow-hidden shadow-lg">
//           <Image
//             src="/background.jpg"
//             alt="Casting Talent"
//             width={800}
//             height={400}
//             className="rounded-lg w-auto h-auto"
//           />
//         </div>
//       </motion.section>

//       {/* ✅ Explore Section */}
//       <section id="explore" className="py-16 px-6 text-center bg-white dark:bg-darkBg mt-16">
//         <h2 className="text-3xl font-bold text-primary dark:text-dark-primary">Explore Opportunities</h2>
//         <p className="text-text dark:text-dark-text mt-4 max-w-3xl mx-auto">
//           Browse through different categories and find the perfect opportunity for your talent.
//         </p>

//         <div className="mt-8 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
//           {[
//             { title: "Acting Roles", description: "Find auditions for TV, film, and theater.", image: "/explore_icons/actor.png" },
//             { title: "Modeling Jobs", description: "Get discovered by top brands and agencies.", image: "/explore_icons/model.png" },
//             { title: "Voice Acting", description: "Showcase your voice talent for commercials & animation.", image: "/explore_icons/voice.png" },
//             { title: "Extras & Crew", description: "Join productions as an extra or crew member.", image: "/explore_icons/crew.png" },
//           ].map((item, index) => (
//             <ExploreCard key={index} {...item} />
//           ))}
//         </div>
//       </section>

//       {/* ✅ About Us Section */}
// {/* ✅ About Us Section */}
// <section id="about-us" className="py-16 bg-neutral dark:bg-darkBg text-text dark:text-darkText">
//   <div className="max-w-7xl mx-auto px-6">
//     {/* Section Header */}
//     <motion.h2
//       initial={{ opacity: 0, y: -30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       viewport={{ once: true }}
//       className="text-4xl font-bold text-center text-primary dark:text-secondary"
//     >
//       About Us
//     </motion.h2>

//     {/* Section Content */}
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       transition={{ staggerChildren: 0.3 }}
//       variants={{
//         hidden: {},
//         visible: {},
//       }}
//       viewport={{ once: true }}
//       className="mt-12 grid md:grid-cols-2 gap-8 items-center"
//     >
//       {/* Left: Image */}
//       <motion.div
//         variants={{
//           hidden: { opacity: 0, scale: 0.9, x: -50 },
//           visible: { opacity: 1, scale: 1, x: 0 },
//         }}
//         transition={{ duration: 0.7, ease: "easeOut" }}
//         className="overflow-hidden rounded-lg shadow-lg"
//       >
//         <Image
//           src="/about.jpg"
//           alt="Casting Process"
//           className="w-full h-auto object-cover"
//           width={1080}
//           height={1080}
//         />
//       </motion.div>

//       {/* Right: Text Content */}
//       <motion.div
//         variants={{
//           hidden: { opacity: 0, y: 30 },
//           visible: { opacity: 1, y: 0 },
//         }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <motion.h3
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-2xl font-semibold text-accent dark:text-white"
//         >
//           Connecting Talent with Opportunity
//         </motion.h3>
//         <p className="mt-4 text-lg leading-relaxed">
//           We are a leading casting platform that helps talented individuals connect with top casting directors,
//           agencies, and production houses. Our mission is to provide artists with the right opportunities to
//           showcase their talent and build successful careers.
//         </p>
//         <p className="mt-4 text-lg leading-relaxed">
//           Whether you&apos;re an aspiring actor, model, or voice-over artist, we ensure your skills get the
//           attention they deserve.
//         </p>
//       </motion.div>
//     </motion.div>
//   </div>
// </section>
//      {/* ✅ Services Section with Motion */}
// {/* <motion.section
//   id="services"
//   initial={{ opacity: 0, y: 50 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.8, ease: "easeOut" }}
//   viewport={{ once: true }}
//   className="py-16 px-6 text-center bg-white dark:bg-darkBg"
// >
//   <motion.h2
//     initial={{ opacity: 0, y: -20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6 }}
//     viewport={{ once: true }}
//     className="text-3xl font-bold text-[#5B408C] dark:text-dark-primary"
//   >
//     Our Services
//   </motion.h2> */}

//   <motion.p
//     initial={{ opacity: 0, y: 10 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6, delay: 0.2 }}
//     viewport={{ once: true }}
//     className="text-gray-700 dark:text-dark-text mt-4 max-w-3xl mx-auto"
//   >
//     Explore our professional casting services designed to connect talent with opportunities.
//   </motion.p>

//   <motion.div
//     initial="hidden"
//     whileInView="visible"
//     transition={{ staggerChildren: 0.2 }}
//     variants={{
//       hidden: {},
//       visible: {},
//     }}
//     viewport={{ once: true }}
//     className="mt-8 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
//   >
//     {[
//       {
//         title: "Casting Calls",
//         description: "Find the latest casting calls and apply with ease.",
//         icon: "/services_icons/casting-call.png",
//       },
//       {
//         title: "Talent Management",
//         description: "Manage your profile, showcase your talent, and get noticed.",
//         icon: "/services_icons/talent-management.png",
//       },
//       {
//         title: "Production Support",
//         description: "Connect with filmmakers and production houses for collaborations.",
//         icon: "/services_icons/production.png",
//       },
//     ].map((item, index) => (
//       <motion.div
//         key={index}
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: index * 0.2 }}
//         className="w-full"
//       >
//         <ServiceCard {...item} />
//       </motion.div>
//     ))}
//   </motion.div>
// </motion.section>
//     {/* ✅ Testimonials Section with Animation */}
//     <section className="pt-16 px-6 text-center">
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-3xl font-bold text-[#5B408C]"
//         >
//           What Our Users Say
//         </motion.h2>

//         <div className="mt-8 max-w-4xl mx-auto h-32 relative overflow-hidden">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentIndex}
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -30 }}
//               transition={{ duration: 0.6 }}
//               className="absolute w-full"
//             >
//               <blockquote className="text-lg italic text-black dark:text-white">
//                 &quot;{testimonials[currentIndex].quote}&quot;
//               </blockquote>
//               <p className="mt-4 font-bold text-black dark:text-white">
//                 - {testimonials[currentIndex].name}, {testimonials[currentIndex].role}
//               </p>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </section>
//      {/* ✅ Call to Action Section with Motion */}
// <motion.section
//   initial={{ opacity: 0, y: 50 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.8, ease: "easeOut" }}
//   viewport={{ once: true }}
//   className="py-16 px-6 text-center bg-gradient-to-r from-[#5B408C] to-[#8E3F67] text-white rounded-lg shadow-lg mx-4 md:mx-16 my-16 mt-0"
// >
//   <motion.h2
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6, delay: 0.2 }}
//     viewport={{ once: true }}
//     className="text-4xl font-bold"
//   >
//     Ready to Get Started?
//   </motion.h2>

//   <motion.p
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6, delay: 0.4 }}
//     viewport={{ once: true }}
//     className="mt-4 max-w-2xl mx-auto text-lg leading-relaxed"
//   >
//     Take the next step in your career and join a thriving community of talent.
//   </motion.p>

//   <motion.div
//     initial={{ opacity: 0, scale: 0.9 }}
//     whileInView={{ opacity: 1, scale: 1 }}
//     transition={{ duration: 0.6, delay: 0.6 }}
//     viewport={{ once: true }}
//     className="mt-8"
//     whileHover={{ scale: 1.05 }}
//   >
//     <Link
//       href="/signup"
//       className="inline-block px-8 py-4 bg-white text-[#8E3F67] font-semibold text-lg rounded-lg shadow-md hover:bg-[#F4F0F9] hover:text-[#5B408C] transition-transform transform"
//     >
//       Sign Up Now
//     </Link>
//   </motion.div>
// </motion.section>
//       <Footer />
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import useThemeStore from "@/store/themeStore"; // Import Zustand for dark mode
import { AnimatePresence, motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
// ✅ ExploreCard Component
const ExploreCard = ({ title, description, image }) => (
  <div className="bg-neutral dark:bg-dark-cardBg p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg">
    <Image src={image} alt={title} width={64} height={64} priority />
    <h3 className="text-xl font-semibold mt-4 text-primary dark:text-dark-primary">{title}</h3>
    <p className="text-text dark:text-dark-text mt-2 text-sm">{description}</p>
  </div>
);

// ✅ ServiceCard Component
const ServiceCard = ({ title, description, icon }) => (
  <div className="bg-white dark:bg-dark-cardBg p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg">
    <Image src={icon} alt={title} width={64} height={64} priority />
    <h3 className="text-xl font-semibold mt-4 text-accent dark:text-dark-accent">{title}</h3>
    <p className="text-text dark:text-dark-text mt-2 text-sm">{description}</p>
  </div>
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

export default function Home() {
  const { darkMode } = useThemeStore(); // Zustand for dark mode
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Automatic Testimonials Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-neutral dark:bg-darkBg ${darkMode ? "dark" : ""}`}>
      {/* ✅ Hero Section with Animations */}
      <motion.section
        id="home"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center pt-28 md:pt-36 px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-black dark:text-white leading-snug"
        >
          Discover Your Next Star: <br />
          <span className="text-primary dark:text-dark-primary">Unleash Your Talent</span> with Our Casting Services
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="text-text dark:text-dark-text mt-4 max-w-2xl"
        >
          Join us to find the perfect talent for your next production project today!
        </motion.p>

        {/* Buttons with Proper Mobile Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
            <Link
              href="/#explore"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg text-center hover:bg-dark-primary transition-transform block"
            >
              Explore
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-dark-cardBg text-primary border border-primary rounded-lg text-center hover:bg-primary hover:text-white transition-transform block"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ✅ Image Section with Fade-In Effect */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-12 px-6 flex justify-center"
      >
        <div className="max-w-4xl rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/background.jpg"
            alt="Casting Talent"
            width={800}
            height={400}
            className="rounded-lg w-auto h-auto"
          />
        </div>
      </motion.section>

      {/* ✅ Explore Section */}
      <motion.section
  id="explore"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
  variants={containerVariants}
  className="py-16 px-6 text-center bg-white dark:bg-darkBg mt-16"
>
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-3xl font-bold text-primary dark:text-dark-primary"
  >
    Explore Opportunities
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="text-text dark:text-dark-text mt-4 max-w-3xl mx-auto"
  >
    Browse through different categories and find the perfect opportunity for your talent.
  </motion.p>

  <motion.div
    className="mt-8 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto"
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

      {/* ✅ About Us Section */}
      <section id="about-us" className="py-16 bg-neutral dark:bg-darkBg text-text dark:text-darkText">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-primary dark:text-secondary"
          >
            About Us
          </motion.h2>

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
            className="mt-12 grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Left: Image */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9, x: -50 },
                visible: { opacity: 1, scale: 1, x: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src="/about.jpg"
                alt="Casting Process"
                className="w-full h-auto object-cover"
                width={1080}
                height={1080}
              />
            </motion.div>

            {/* Right: Text Content */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ✅ Services Section with Motion */}
      <motion.section
        id="services"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-16 px-6 text-center bg-white dark:bg-darkBg"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-[#5B408C] dark:text-dark-primary"
        >
          Our Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-700 dark:text-dark-text mt-4 max-w-3xl mx-auto"
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
          className="mt-8 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="w-full"
            >
              <ServiceCard {...item} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ✅ Testimonials Section with Animation */}
      <section className="pt-16 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-[#5B408C]"
        >
          What Our Users Say
        </motion.h2>

        <div className="mt-8 max-w-4xl mx-auto h-32 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              className="absolute w-full"
            >
              <blockquote className="text-lg italic text-black dark:text-white">
                &quot;{testimonials[currentIndex].quote}&quot;
              </blockquote>
              <footer className="mt-4 text-sm text-gray-600 dark:text-dark-text">
                — {testimonials[currentIndex].name}, {testimonials[currentIndex].role}
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
{/* ✅ Call to Action Section with Motion */}
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
  className="py-16 px-6 text-center bg-gradient-to-r from-[#5B408C] to-[#8E3F67] text-white rounded-lg shadow-lg mx-4 md:mx-16 my-16 mt-0"
>
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    viewport={{ once: true }}
    className="text-4xl font-bold"
  >
    Ready to Get Started?
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    viewport={{ once: true }}
    className="mt-4 max-w-2xl mx-auto text-lg leading-relaxed"
  >
    Take the next step in your career and join a thriving community of talent.
  </motion.p>

  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.6 }}
    viewport={{ once: true }}
    className="mt-8"
    whileHover={{ scale: 1.05 }}
  >
    <Link
      href="/signup"
      className="inline-block px-8 py-4 bg-white text-[#8E3F67] font-semibold text-lg rounded-lg shadow-md hover:bg-[#F4F0F9] hover:text-[#5B408C] transition-transform transform"
    >
      Sign Up Now
    </Link>
  </motion.div>
</motion.section>
      {/* ✅ Footer Section */}
      <Footer />
    </div>
  );
}