"use client";

import { TechChip } from "../TechChip";
import { IProjectCard } from "@/types/project";
import { Card, CardBody, CardHeader, Image } from "@heroui/react"

export default function ProjectCard(props: IProjectCard) {
	return (		
		<Card className="group h-full bg-gray-900/50 border border-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-gray-700">
			<CardHeader className="p-0 relative h-fit w-full overflow-hidden bg-gray-800">
				<Image
					radius="none"
					alt={props.title}
					src={props.image}
					className="object-cover"
				/>
			</CardHeader>

			<CardBody className="p-6 space-y-4 flex h-full flex-col justify-between gap-4">
				<h2 className="text-xl font-bold text-white">
					{props.title}
				</h2>

				<p className="text-gray-300 text-sm leading-relaxed">
					{props.description}
				</p>

				<div className="flex flex-wrap gap-3 pt-2">
					{props.techs.map((tech, i) => (
						<TechChip
							key={i}
							name={tech.name}
							icon={tech.icon}
							color={tech.color}
						/>
					))}
				</div>
			</CardBody>
		</Card>
	)
}
