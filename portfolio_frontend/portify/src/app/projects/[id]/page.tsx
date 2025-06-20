import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectContent } from "@/components/Project/ProjectContent";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
   const { id } = await params;
   const project = projects.find((p) => p.id === id);

   if (!project) return notFound();

   return (
      <main className="mx-auto max-w-7xl pt-20">
         <ProjectContent {...project}/>
      </main>
   );
}
