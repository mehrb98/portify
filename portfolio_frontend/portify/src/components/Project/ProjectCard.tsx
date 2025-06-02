"use client";

import Link from "next/link";
import { IProjectCard } from "../../types/project";

export default function ProjectCard({
  id,
  image,
  title,
  description,
  techs,
}: IProjectCard) {
//   const [imageError, setImageError] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

	return (
		<Link href={`/projects/${id}`} className="h-full">
			<div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-purple-500/10">
			<div className="relative h-60 w-full overflow-hidden bg-gray-800">
				{image}
				{/* <Image
					priority
					width={1600}
					height={900}
					alt={title}
					onError={() => setImageError(true)}
					onLoadingComplete={() => setIsLoading(false)}
					src={imageError ? '/placeholder-project.jpg' : image}
					className={`h-full w-full object-cover transition-all duration-500 
					${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'} group-hover:scale-110`}
				/> */}
			</div>

			<div className="flex h-full flex-col justify-between gap-4 p-6">
				<div>
					<h3 className="mb-2 text-xl font-bold text-gray-100">
					{title}
					</h3>

					<p className="text-gray-400">{description}</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{techs?.map((techItem, i) => (
					<span
						key={i}
						className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
					>
						{techItem.name}
					</span>
					))}
				</div>
			</div>
			</div>
		</Link>
  	);
}
