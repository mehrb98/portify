import dynamic from "next/dynamic";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const World = dynamic(() => import("../../src/components/ui/globe").then((m) => m.World), {
   ssr: false,
});

// import logos from '../../data/logo-map.json' assert { type: "json" };

// export function svg(name: string): string | null {
//   return (logos as Record<string, string>)[name] ?? null;
// }


 
