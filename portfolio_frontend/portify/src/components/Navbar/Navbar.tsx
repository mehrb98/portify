"use client";

import Link from 'next/link';
import { useState } from 'react';
import SocialLink from './SocialLink';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import MenuItem from "../MenuItem/MenuItem";
import { FaBars, FaX } from 'react-icons/fa6';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const navItems = [
   { name: 'About me', href: '#about-me' },
   { name: 'Skills', href: '#skills' },
   { name: 'Projects', href: '#projects' },
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
      isMenuOpen: false,
   });

  const toggleMenu = () => setUiState((prev) => 
   ({ ...prev, isMenuOpen: !prev.isMenuOpen }));

   return (
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} 
         className={"fixed w-full z-50 backdrop-blur-lg bg-background/50 transition-all duration-300 ease-out"}
      >
         <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
               <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href={"/"} className="flex items-center gap-2 group">
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
                  </Link>
               </motion.div>
            
               <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-6 bg-background/80 px-4 py-2 rounded-full border border-white/5 shadow-lg shadow-primary/5">
                     {navItems.map((item, i) => 
                        <MenuItem key={item.name} index={i} href={item.href}>
                           {item.name}
                        </MenuItem>
                     )}
                  </div>

                  <div className="h-6 w-px bg-white/10 mx-2"></div>

                  {socialLinks.map((social, i) => 
                     <SocialLink  
                        key={"social-link-" + i} 
                        link={social.link} 
                        icon={social.icon} 
                     />
                  )}
               </div>

               {/* Mobile Menu Button */}
               <Button 
                  isIconOnly
                  onPress={toggleMenu}
                  className="md:hidden rounded-lg bg-white/5 hover:bg-primary/10 transition-colors"
               >
                  {uiState.isMenuOpen 
                     ? <FaX className="h-6 w-6 text-content/80" />
                     : <FaBars className="h-6 w-6 text-content/80" />
                  }
               </Button>
            </div>

            {/* Mobile Menu */}
            {uiState.isMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:hidden mt-4 pb-4 space-y-4"
               >
                  {navItems.map((item) => (
                     <Link
                        key={item.name}
                        href={item.href}
                        onClick={toggleMenu}
                        className="block px-4 py-2 text-content/80 hover:text-primary hover:bg-white/5 
                        rounded-lg transition-colors"
                     >
                        {item.name}
                     </Link>
                  ))}

                  <div className="pt-4 border-t border-white/5 flex gap-2">
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
