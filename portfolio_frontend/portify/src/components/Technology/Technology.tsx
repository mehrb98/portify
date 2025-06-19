import Image from 'next/image';
import { ILogo } from '../../types/tech';

export const logos = [
   {
      src: "/images/svg/WordPress.svg.png",
      alt: "WordPress",
      name: "WordPress",
   },
   {
      src: "/images/svg/csharp.svg",
      alt: "C#",
      name: "C#",
   },
   {
      src: "/images/svg/mysql.svg.png",
      alt: "MySQL",
      name: "MySQL",
   },
   {
      src: "/images/svg/postgresql.svg",
      alt: "PostgreSQL",
      name: "PostgreSQL",
   },
   {
      src: "/images/svg/docker.png",
      alt: "Docker",
      name: "Docker",
   },
   {
      src: "/images/svg/github.svg",
      alt: "Git/Github",
      name: "Git/GitHub",
   },
   {
      src: "/images/svg/rails.svg.png",
      alt: "Ruby On Rails",
      name: "Ruby On Rails",
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
   }
];

const Logo = (props: ILogo) => (
   <div className={"flex items-center gap-2 self-center lg:gap-2"}>
      <div className={"flex h-10 w-10 items-center justify-center"}>
         <Image
            width={40}
            height={40}
            alt={props.alt}
            src={props.src}
            className={"object-contain"}
         />
      </div>

      {props.name && 
         <div className={"text-sm font-semibold lg:text-base"}>
            {props.name}
         </div>
      }
   </div>
);

const LogoList = ({ count = 2, offset = 0 }: { count?: number; offset?: number }) => (
   <>
      {Array.from({ length: count }, (_, i) => (
         <div key={offset + i} className={"flex items-center-safe"}>
            {logos.map((logo, index) => (
               <div 
                  key={`${offset + i}-${index}`}
                  className={"inline-flex items-center px-6"}
               >
                  <Logo {...logo} />
               </div>
            ))}
         </div>
      ))}
   </>
);

export default function Technology() {
   return (
      <section id={"skills"} className={"py-20 h-full scroll-mt-20"}>
         <div className={"relative z-40 mx-auto flex flex-col gap-10 text-white lg:max-w-7xl"}>
            <h1 className={"text-center !text-3xl"}>
               Working with up-to-date technology
            </h1>

            <div
               className={"relative flex w-full overflow-hidden"}
               style={{
                  maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent 100%)",
               }}
            >
               <div className={"flex animate-marquee-scroll whitespace-nowrap py-6"}>
                  <LogoList count={2} offset={0} />
               </div>

               <div
                  aria-hidden={"true"}
                  style={{ animationDelay: '-20s' }}
                  className={"flex animate-marquee-scroll whitespace-nowrap py-6"}
               >
                  <LogoList count={2} offset={2} />
               </div>
            </div>

            <p className={"text-center !text-md opacity-60"}>
               Staying ahead of the curve and surfing the waves of innovation
            </p>
         </div>
      </section>
   );
}
