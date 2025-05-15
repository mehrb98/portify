"use client";

import React from "react";
import { World } from "../../utils/utils";
import { arcs, config } from "./arcs";

export function Globe() {
   return (
      <div className="min-h-screen relative z-40 mx-auto mt-[50px] flex flex-col gap-3 text-white lg:mb-0 lg:max-w-[1080px] lg:gap-6">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
               <div className="absolute w-full h-full md:h-full z-10">
                  <World data={arcs} globeConfig={config} />
               </div>
            </div>
         </div>
      // </div>
   );
}
