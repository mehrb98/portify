// "use client";

// import { projects } from "./data";
// import ProjectCard from './ProjectCard';

// export default function Projects() {
//    return (
//       <section className="min-h-screen px-12">
//          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 h-full mt-10">
//             { projects.map((project, i) => (
//                <ProjectCard
//                   key={i}
//                   {...project}
//                />
//                <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 50 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: i * 0.1 }}
//                   whileHover={{ y: -10,transition: { duration: 0.2 }}}
//                   className="group relative h-[500px] rounded-3xl overflow-hidden 
//                   bg-surface border border-white/10 cursor-pointer"
//                >
//                   <motion.div
//                      className="h-[250px] relative"
//                      whileHover={{ scale: 1.05 }}
//                      transition={{ duration: 0.2 }}
//                   >
//                      <Image
//                            fill
//                            priority
//                            src={project.image}
//                            alt={project.title}
//                            className="object-cover"
//                            sizes="(max-width: 768px) 100vw, 33vw"
//                      />
//                   </motion.div>

//                   <motion.div className="p-6 h-[25px] bg-surface" transition={{ duration: 0.3 }}>
//                      <div className="flex justify-between items-start mb-4 group/title">
//                         <h3 className="text-2xl font-bold text-content">
//                            {project.title}
//                         </h3>

//                         <FiArrowUpRight size={30} className={"bg-white"}/>
//                      </div>

//                      <p className="text-content/80 mb-4">
//                         {project.description}
//                      </p>

//                      <div className="flex flex-wrap gap-2">
//                         {project.techs.map((tech, i) => (
//                            <span
//                               key={i}
//                               className="px-3 py-1 rounded-full bg-white/5 text-content/80
//                               text-sm border border-white/5
//                               hover:bg-surface transition-colors flex items-center
//                               gap-1.5 group/tech"
//                            >
//                                  <tech.icon
//                                     style={{ color: tech.color }}
//                                     className="w-4 h-4 transition-colors" />

//                                  <span className="group-hover/tech:text-content transition-colors">
//                                     {tech.name}
//                                  </span>
//                            </span>
//                         ))}

//                      </div>
//                   </motion.div>
//                </motion.div>
//             ))}
//          </div>
//       </section>
//    )
// }