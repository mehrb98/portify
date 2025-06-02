"use client";

import { useState } from 'react';
import SocialLink from './SocialLink';
import MenuItem from "../MenuItem/MenuItem";
import { FaBurger, FaX } from 'react-icons/fa6';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

const navItems = [
   { name: 'Projects', href: '#work' },
   { name: 'My Skills', href: '#skills' },
   { name: 'Works', href: '#works' },
   { name: 'Contact', href: '#contact' },
];

const socialLinks = [
   {
      icon: FaGithub,
      platform: "GitHub",
      link: "https://github.com/mehrb98"
   },
   {
      icon: FaLinkedin,
      platform: "LinkedIn",
      link: "https://www.linkedin.com/in/mehrulloh-boboev-a28b83185/"
   }
];

export default function Navbar() {
   const [uiState, setUiState] = useState({
      isScrolled: false,
      isMenuOpen: false,
   });

   const { scrollY } = useScroll();

   useMotionValueEvent(scrollY, 'change', (latest) => {
      setUiState((prev) => ({ ...prev, isScrolled: latest > 50 }));
   });

  const toggleMenu = () => setUiState((prev) => 
   ({ ...prev, isMenuOpen: !prev.isMenuOpen }));

   return (
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} 
         className={`fixed w-full z-50 ${uiState.isScrolled 
         ? "backdrop-blur-2xl bg-background/90 shadow-2xl shadow-primary/10"
         : 'backdrop-blur-lg bg-background/50'} transition-all duration-300 ease-out`}
      >
         <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">

               <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 group">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-primary to-tertiary animate-spin-slow [mask-image:linear-gradient(transparent,white)]" />

                     <div className="absolute inset-[2px] bg-background rounded-full flex items-center justify-center">
                        <span className="font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                           MB
                        </span>
                     </div>
                  </div>

                  <span className="font-semibold text-content/90 group-hover:text-primary transition-colors">
                     Mehrulloh Boboev
                  </span>
               </motion.div>
            
               <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-6 bg-background/80 px-4 py-2 rounded-full border border-white/5 shadow-lg shadow-primary/5">
                     {navItems.map((item, i) => 
                        <MenuItem key={item.name} index={i} href={item.href}>
                           {item.name}
                        </MenuItem>
                     )}
                  </div>

                  <div className="h-6 w-px bg-white/10 mx-2" />

                  {socialLinks.map((social, i) => 
                     <SocialLink  
                        key={"social-link-" + i} 
                        link={social.link} 
                        icon={social.icon} 
                     />
                  )}
               </div>

               {/* Mobile Menu Button */}
               <button onClick={toggleMenu} className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-primary/10 transition-colors">
                  {uiState.isMenuOpen 
                     ? <FaX className="h-6 w-6 text-content/80" />
                     : <FaBurger className="h-6 w-6 text-content/80" />
                  }
               </button>
            </div>

            {/* Mobile Menu */}
            {uiState.isMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:hidden mt-4 pb-4 space-y-4"
               >

               {navItems.map((item) => (
                  <a
                     key={item.name}
                     href={item.href}
                     onClick={toggleMenu}
                     className="block px-4 py-2 text-content/80 hover:text-primary hover:bg-white/5 
                     rounded-lg transition-colors"
                  >
                     {item.name}
                  </a>
               ))}

               <div className="pt-4 border-t border-white/5">
                  {socialLinks.map((social, i) => 
                     <SocialLink  
                        key={"social-link-" + i} 
                        link={social.link} 
                        icon={social.icon} 
                     />
                  )}
               </div>

               </motion.div>
            )}
         </div>
      </motion.nav>
   );
}
