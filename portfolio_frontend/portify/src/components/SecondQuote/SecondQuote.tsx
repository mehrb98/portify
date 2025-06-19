"use client";

import React from "react";
import Image from "next/image";
import quoteCircles from "@/images/svg/2nd-quote-circles.svg";
import quoteBGBlur from "@/images/svg/2nd-quote-bg-blur.svg";

const quote = {
  text: "Simplicity is the ultimate sophistication.",
  author: "Leonardo Da Vinci",
};

export default function SecondQuote() {
   return (
      <div className="relative my-20 lg:my-40 flex flex-col items-center justify-center">
         <Image
            src={quoteBGBlur}
            alt="Quote BG Blur"
            className="absolute z-0"
         />

         <div className="relative z-10">
            <Image src={quoteCircles} alt="Quote Circles" />
         </div>

         <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h2 className="bg-gradient-to-b from-white to-[#CC53C7] bg-clip-text text-2xl lg:text-6xl font-medium text-transparent">
               {quote.text}
            </h2>
            
            <p className="mt-2 text-lg lg:text-2xl font-extralight text-white/50">
               - {quote.author}
            </p>
         </div>
      </div>
   );
}
