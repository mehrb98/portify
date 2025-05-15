import Image from 'next/image';

export const logos = [
  {
    src: "/images/svg/python.svg",
    alt: 'Python Logo',
    name: 'Python',
  },
  {
    src: "/images/svg/tailwind.svg",
    alt: 'Tailwind CSS Logo',
    name: 'Tailwind CSS',
  },
  {
    src: "/images/svg/react-logo.svg",
    alt: 'React Logo',
    name: 'React',
  },
  {
    src: "/images/svg/TS-Logo.svg",
    alt: 'TypeScript Logo',
    name: 'TypeScript',
  },
  {
    src: "/images/svg/figma-logo.svg", 
    alt: 'Figma Logo',
    name: 'Figma',
  },
  {
    src: "/images/svg/Vercel-Logo.svg",  
    alt: 'Vercel Logo',
    name: 'Next.js',
  },
  {
    src: "/images/svg/ethereum-logo.svg", 
    alt: 'Ethereum Logo',
    name: 'Ethereum',
  },
  {
    src: "/images/svg/solidity-logo.svg",  
    alt: 'Solidity Logo',
    name: 'Solidity',
  },
  {
    src: "/images/svg/ethersjs-logo.svg", 
    alt: 'Ethers.js Logo',
    name: 'Ethers.js',
  },
  {
    src: "/images/svg/rainbowkit-logo.svg",  
    alt: 'RainbowKit Logo',
    name: 'RainbowKit',
  },
  {
    src: "/images/svg/openai-logo.svg",  
    alt: 'OpenAI Logo',
    name: 'AI/ML',
  },
];

interface LogoProps {
   name: string;
   src: string | string[];
   alt: string | string[];
   width?: number | number[];
   height?: number | number[];
}

const Logo = ({ src, alt, name, width = 30, height = 30 }: LogoProps) => (
   <div className={"flex items-center gap-2 self-center lg:items-center lg:gap-2"}>
      {Array.isArray(src) ?
         <div className="flex items-center gap-2">
            <div className="flex w-[60px] items-center justify-center">
               <p>{src[0]}</p>

               <Image
                  src={src[0] || ""} 
                  alt={Array.isArray(alt) ? alt[0] || "Image description" : alt || "Image description"}
                  width={Array.isArray(width) ? width[0] : width}
                  height={Array.isArray(height) ? height[0] : height}
                  className="scale-150 invert [&>path]:fill-white"
               />
            </div>
            
            <Image
               src={src[1] || ""}
               alt={Array.isArray(alt) ? alt[1] || "Image description" : alt || "Image description"}
               width={Array.isArray(width) ? width[1] : width}
               height={Array.isArray(height) ? height[1] : height}
            />
         </div> : 

         <div className="flex w-[60px] items-center justify-center">
            <Image
               src={src || ""} 
               alt={alt as string}
               width={width as number}
               height={height as number}
            />
         </div>
      }

      {name && 
         <div className="text-sm font-semibold lg:text-base">{name}</div>
      }
   </div>
);

export const LogoList = ({ startIndex = 0 }: { startIndex?: number }) => (
   <div className="flex items-center">
      {Array.from({ length: 2 }, (_, i) =>
         logos.map((logo, index) => (
            <div key={`logo-${startIndex}-${i}-${index}`} className="inline-flex items-center px-6">
               <Logo {...logo} />
            </div>
         )),
      ).flat()}
   </div>
);

export default function Technology() {
   return (
      <div className="relative z-40 mx-auto mb-[-75px] mt-[50px] flex flex-col gap-3 text-white lg:mb-0 lg:max-w-[1080px] lg:gap-6">
         <h2 className="mx-auto mb-3 w-full px-8 text-center text-sm lg:mb-0 lg:max-w-none lg:px-0 lg:text-xl">
            Working with up-to-date technology
         </h2>

         <div className="relative flex w-full overflow-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent 100%)',
            }}
         >
            <div className="flex animate-marquee-scroll whitespace-nowrap py-6">
               {Array.from({ length: 2 }, (_, i) => (
                  <LogoList key={`list-1-${i}`} startIndex={i} />
               ))}
            </div>

            <div aria-hidden="true" style={{ animationDelay: '-20s' }} className="flex animate-marquee-scroll whitespace-nowrap py-6">
               {Array.from({ length: 2 }, (_, i) => (
                  <LogoList 
                     key={`list-2-${i}`} 
                     startIndex={i + 2} 
                  />
               ))}
            </div>
         </div>

         <p className="mx-auto w-full max-w-[250px] text-center text-sm opacity-60 lg:max-w-none">
            Staying ahead of the curve and surfing the waves of innovation
         </p>
      </div>
   );
}
