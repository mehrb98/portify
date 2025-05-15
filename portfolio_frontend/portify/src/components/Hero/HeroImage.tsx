"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useScroll, useTransform } from "framer-motion";

export default function HeroImage({ src }: { src: string | StaticImageData }) {
   const {scrollY} = useScroll();
   const y = useTransform(scrollY, [0, 500], [0, 100]);

   return (
      <motion.div
         style={{y}}
         className="lg:w-1/2 relative"
         animate={{ opacity: 1, x: 0 }}
         initial={{ opacity: 0, x: 50 }}
         transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
         <div className="realtive w-full aspect-square group">
            <motion.div 
               animate={{ y: [0, -20, 0] }} 
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut"}}
               className="relative w-full aspect-square rounded-3xl overflow-hidden border border-white/10 bg-surface 
               backdrop-blur-sm"
            >
               <Image
                  src={src}
                  alt="Avatar"
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500" 
               />

               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-8 left-8"
               >
                  <motion.h1
                     style={{ backgroundSize: '200% 200%' }}
                     animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
                     transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                     className={"block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-2xl font-bold"}
                  >
                     Germany, Stuttgart
                  </motion.h1>
               </motion.div>
            </motion.div>
         </div>
      </motion.div>
   )
}