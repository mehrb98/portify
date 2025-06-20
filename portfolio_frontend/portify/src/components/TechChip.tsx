"use client";

import { Chip } from "@heroui/react";
import { iconMap } from "../utils/utils";
import { ITech } from "../types/project";


export function TechChip({ name, icon, color }: ITech) {
   const Icon = iconMap[icon as keyof typeof iconMap];
   
   return (
      <Chip
         size="md"
         variant="flat"
         startContent={Icon ? <Icon color={color} /> : null}
         className="bg-gray-700/80 text-gray-200 hover:bg-gray-600/80 transition-colors p-3"
      >
         {name}
      </Chip>
   );
}
