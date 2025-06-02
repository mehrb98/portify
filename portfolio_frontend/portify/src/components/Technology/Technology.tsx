import Image from 'next/image';

export const logos = [
  {
      src: "/images/svg/WordPress.svg.png",
      alt: "WordPress",
      width: 500,
      hight: 500
  },
  {
      src: "/images/svg/csharp.svg",
      alt: "C#",
      name: "C#"
  },
  {
      src: "/images/svg/mysql.svg.png",
      alt: "MySQL",
      name: "MySQL"
  },
  {
      src: "/images/svg/postgresql.svg",
      alt: "PostgreSQL",
      name: "PostgreSQL"
  },
  {
      src: "/images/svg/docker.png",
      alt: "Docker",
      name: "Docker",
      width: 500,
      hight: 500
  },
  {
      src: "/images/svg/github.svg",
      alt: "Git/Github",
      name: "Git/GitHub",
  },
  {
      src: "/images/svg/rails.svg.png",
      alt: "Ruby On Rails",
      width: 500,
      hight: 500,
  },
  {
      src: "/images/svg/ruby.svg",
      alt: "Ruby Logo",
      name: "Ruby",
  },
  {
      src: "/images/svg/tailwind.svg",
      alt: "Tailwind CSS",
      name: "Tailwind CSS",
  },
  {
      src: "/images/svg/react.svg",
      alt: "React",
      name: "React",
  },
  {
      src: "/images/svg/typescript.svg",
      alt: "TypeScript",
      name: "TypeScript",
  },
  {
      src: "/images/svg/next-js.svg",  
      alt: "Next.js",
      name: "Next.js",
  },
  {
      src: "/images/svg/openai.svg",  
      alt: "OpenAI Logo",
      name: "AI",
  },
];

interface LogoProps {
   name: string;
   src: string;
   alt: string;
   width?: number;
   height?: number;
}

const Logo = ({ src, alt, name, width = 40, height = 40 }: LogoProps) => (
   <div className={"flex items-center gap-2 self-center lg:items-center lg:gap-2"}>
      {Array.isArray(src) ?
         <div className="flex items-center gap-2">
            <div className="flex w-[60px] items-center justify-center">
               <p>{src[0]}</p>

               <Image
                  src={src[0] || ""} 
                  width={width | 50}
                  height={height | 50}
                  alt={alt || "Image description"}
                  className="scale-150 invert [&>path]:fill-white"
               />
            </div>
            
            <Image
               src={src || ""}
               alt={alt || "Image description"}
               width={width}
               height={height}
            />
         </div> : 

         <div className="flex w-[60px] items-center justify-center">
            <Image
               src={src || ""} 
               alt={alt}
               width={width}
               height={height}
            />
         </div>
      }

      {name && <div className="text-sm font-semibold lg:text-base">{name}</div>}
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
                  <LogoList key={`list-${i}`} startIndex={i} />
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
