"use client"

import { useState } from "react"
import { TechChip } from "../TechChip"
import { ITech } from "../../types/project"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Image, Card, CardBody, Chip, Link, Skeleton } from "@heroui/react"

interface IProjectLink {
   url: string
   title: string
}

interface IProjectContent {
   title?: string
   date?: string
   techs?: ITech[];
   images_src?: string
   description?: string
   links?: IProjectLink[]
   full_description?: string
}

export function ProjectContent(props: IProjectContent) {
   const [isLoading, setIsLoading] = useState(true)

   return (
      <div className="flex flex-col gap-8 max-w-7xl min-h-screen mx-auto p-6 text-white">
         <div className="relative w-full">
            <Skeleton isLoaded={!isLoading} className="rounded-xl">
               <Image
                  radius="lg"
                  shadow="lg"
                  alt={props.title}
                  src={props.images_src || "/placeholder.svg"}
                  className="w-full aspect-video object-cover"
                  classNames={{
                     wrapper: "w-full",
                     img: "w-full h-full object-cover",
                  }}
                  onLoad={() => setIsLoading(false)}
               />
            </Skeleton>

         </div>

         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            <div className="lg:col-span-2">
               <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <h1 className="text-4xl font-bold">
                     {props.title}
                  </h1>
                  
                  <Chip 
                     size="sm"
                     variant="flat" 
                     color="default" 
                  >
                     {props.date}
                  </Chip>
               </div>

               <Card className="bg-content1/30 backdrop-blur-sm">
                  <CardBody className="p-6">
                     <article className="prose prose-neutral dark:prose-invert max-w-none">
                        {props.full_description}
                     </article>
                  </CardBody>
               </Card>
            </div>

            <div className="h-fit lg:sticky lg:top-8">
               <Card className="bg-content1/80 backdrop-blur-sm">
                  <CardBody className="p-6 space-y-8">
                     <h2 className="mb-4 text-xl font-semibold">
                        Project Links
                     </h2>

                     <div className="flex flex-col gap-3">
                        {props.links?.map((link) => (
                           <Link
                              key={link.url}
                              href={link.url}
                              isExternal
                              showAnchorIcon
                              color="primary"
                              className="flex items-center gap-2 text-sm"
                              anchorIcon={<FaExternalLinkAlt className="h-4 w-4" />}
                           >
                              {link.title}
                           </Link>
                        ))}
                     </div>

                     <h2 className="mb-4 text-xl font-semibold text-foreground">
                        Technologies
                     </h2>

                     <div className="flex flex-wrap gap-2">
                        {props.techs?.map((tech, i) => (
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
            </div>
         </div>
      </div>
   )
}
