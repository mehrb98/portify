import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectContent } from "@/components/Project/ProjectContent";

export default async function Page({ params }: { params: { id: string } }) {
   const projectId = params.id;
   const project = projects.find(p => p.id.toString() === projectId);

   if (!project) return notFound();

   return (
      <main className="mx-auto max-w-7xl pt-20">
         <ProjectContent {...project}/>
      </main>
   );
}
