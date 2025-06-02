"use client";

import HeroText from './HeroText';
import HeroImage from './HeroImage';
import portify from "../../../public/portify.jpeg";
import { ParticleCanvas } from "@/hooks/particle";

export default function Hero() {
   return (
      <section className="min-h-screen relative overflow-hidden bg-black">
         <ParticleCanvas/>
         
         <div className="max-w-7xl mx-auto px-6 pt-32">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <HeroText />
               <HeroImage src={portify} />
            </div>
         </div>
         
      </section>
   );
}