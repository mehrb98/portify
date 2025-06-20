import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectContent } from "@/components/Project/ProjectContent";

type TPage = {
   params: { id: string }
};

export default async function Page({ params }: TPage) {
   console.log("Project->", projects)

   const projectId = parseInt(params.id);
   const project = projects.find(p => p.id === projectId);

   if (!project) return notFound();

   return (
      <main className="mx-auto max-w-7xl pt-20">
         <ProjectContent {...project}/>
      </main>
   );
}
