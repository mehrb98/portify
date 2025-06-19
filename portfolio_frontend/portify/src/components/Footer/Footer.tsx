"use client";

import React from 'react';
import SocialLink from '../Navbar/SocialLink';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export function Footer() {
   const currentYear = new Date().getFullYear();

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
   
   return (
      <footer className="p-4 text-white">
            <div className="flex flex-wrap justify-center gap-2">
               {socialLinks.map((social, i) => 
                  <SocialLink  
                     key={"social-" + i} 
                     link={social.link} 
                     icon={social.icon} 
                  />
               )}
            </div>

            <p className="mt-8 text-center text-sm">
               © {currentYear} Mehrulloh Boboev, All rights reserved
            </p>
      </footer>
   );
}
