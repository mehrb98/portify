"use client";

import { motion } from "framer-motion";

export default function HeroText() {
   return (
      <motion.div 
         initial={{ opacity: 0, x: -50 }} 
         animate={{ opacity: 1, x: 0 }} 
         transition={{ duration: 1, ease: 'easeOut' }} 
         className="relative group lg:w-1/2"
      >
         <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary
            via-secondary to-tertiary bg-clip-text text-transparent mb-6"
         >
            Full Stack <br />

            <motion.span
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
               className="bg-gradient-to-r from-primary via-secondary 
               to-tertiary bg-clip-text text-transparent"
            >
               Developer
            </motion.span>

         </motion.h1>

         <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-xl text-content/80 mb-8"
         >
            Junior Full-Stack Developer <br/> 
            Next.js & Ruby on Rails Enthusiast
         </motion.p>
      </motion.div>
   )
}