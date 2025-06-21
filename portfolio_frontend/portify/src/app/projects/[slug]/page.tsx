import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectContent } from "@/components/Project/ProjectContent";

export async function generateStaticParams() {
   return projects.map((project) => ({ 
      slug: project.slug 
   }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   const project = projects.find((p) => p.slug === slug);

   if (!project) return notFound();

   return (
      <main className="mx-auto max-w-7xl pt-20">
         <ProjectContent {...project}/>
      </main>
   );
}
