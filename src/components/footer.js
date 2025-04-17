"use client";

import Link from "next/link";
import { useEffect } from "react";
import { animateScroll as scroll, scroller } from "react-scroll";
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  useEffect(() => {
    // Ensure smooth scrolling for Next.js
    document.querySelectorAll('a[href^="/#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(2);
        scroller.scrollTo(targetId, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -80, // Adjust this offset based on navbar height
        });
      });
    });
  }, []);

  return (
    <footer className="bg-[#5B408C] text-white py-8 mt-1"> {/* Reduced padding and margin */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold">Casting Nation</h2>
          <p className="text-gray-300 mt-2 text-sm leading-relaxed">
            Your gateway to the entertainment industry, connecting top talent with exciting casting opportunities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <FooterLink href="/#about-us" text="About Us" />
            <FooterLink href="/#services" text="Our Services" />
            <FooterLink href="/#contact" text="Contact Us" />
            <FooterLink href="/faq" text="FAQs" />
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="mt-3 space-y-2">
            <FooterLink href="mailto:support@castinghub.com" text="support@castingnation.com" icon={<Mail size={18} />} />
            <FooterLink href="tel:+1234567890" text="+1 234 567 890" icon={<Phone size={18} />} />
            <FooterLink href="/privacy-policy" text="Privacy Policy" />
            <FooterLink href="/terms-of-service" text="Terms of Service" />
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            <SocialIcon href="https://instagram.com" icon={<Instagram size={24} />} />
            <SocialIcon href="https://facebook.com" icon={<Facebook size={24} />} />
            <SocialIcon href="https://twitter.com" icon={<Twitter size={24} />} />
            <SocialIcon href="https://linkedin.com" icon={<Linkedin size={24} />} />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-500 mt-8 pt-6 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} Casting Nation. All rights reserved.
      </div>
    </footer>
  );
}

// Reusable Footer Link Component
const FooterLink = ({ href, text, icon }) => (
  <li>
    <Link href={href} className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </Link>
  </li>
);

// Social Icon Component with Hover Effect
const SocialIcon = ({ href, icon }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
    {icon}
  </Link>
);