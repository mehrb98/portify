"use client";

import Link from 'next/link';
import ProjectCard from './ProjectCard';
import { projects } from '../../data/projects';
import { SectionHeading } from "../SectionHeadling";

export default function Projects() {
   return (
      <section className={"mx-auto max-w-7xl px-4 my-20"} id={"projects"}>
         <SectionHeading
            heading="Featured Projects"
            subheading="A collection of my most impactful work in web development"
         />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 h-full mt-10">
            {projects.map((project) => (
               <Link 
                  key={project.id} 
                  href={"/projects/" + project.id}
               >
                  <ProjectCard {...project} />
               </Link>
            ))}
         </div>
      </section>
   )
}