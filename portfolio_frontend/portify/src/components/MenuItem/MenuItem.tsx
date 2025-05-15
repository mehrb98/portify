"use client";

import React from 'react'
import { motion } from 'framer-motion';

interface TMenuItem {
  href: string; 
  index: number; 
  children: React.ReactNode; 
}

export default function MenuItem({children, index, href}: TMenuItem) {
   return ( 
      <motion.a
         href={href}
         whileTap={{scale:0.95}}
         whileHover={{scale:1.05}}
         animate = {{opacity:1, y:0}}
         initial = {{opacity:0, y:-20}}
         className='realtive overflow-hidden px-2 py-1'
         transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
      >
         <span className='text-content/80 hover:text-cyan-600 transition-colors'>
            {children}
         </span>
      </motion.a>
   )
}

