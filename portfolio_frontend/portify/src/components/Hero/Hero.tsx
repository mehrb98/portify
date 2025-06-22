'use client';

import HeroText from './HeroText';
import HeroImage from './HeroImage';
import portify from "../../../public/portify.jpeg";
import { ParticleCanvas } from "@/hooks/particle";

export default function Hero() {
   return (
      <section className={"h-fit relative overflow-hidden bg-black"} id={"about-me"}>
         <ParticleCanvas />

         <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 sm:gap-16">
               <HeroText />
               <HeroImage src={portify} />
            </div>
         </div>
      </section>
   );
}
