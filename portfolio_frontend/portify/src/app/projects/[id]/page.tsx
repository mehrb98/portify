import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectContent } from "@/components/Project/ProjectContent";

type PageProps = {
  params: { id: string; };
};

export default async function Page({ params }: PageProps) {
   const { id } = params
   const project = projects.find(p => p.id.toString() === id);

   if (!project) return notFound();

   return (
      <main className="mx-auto max-w-7xl pt-20">
         <ProjectContent {...project}/>
      </main>
   );
}
