"use client";

import React from 'react';

interface ISectionHeading {
   heading: string;
   subheading: string;
}

export function SectionHeading({
  heading,
  subheading,
}: ISectionHeading) {
   return (
      <div className="mb-20 text-white">
         <h2 className="text-1xl mb-2 text-center font-bold text-white lg:text-3xl">
            {heading}
         </h2>

         <p className="mx-auto mb-8 w-[90%] text-center text-sm text-gray-300/75 lg:text-lg">
            {subheading}
         </p>
      </div>
   );
}