import { FaNode, FaReact } from "react-icons/fa6";
import { SiD3Dotjs, SiFirebase, SiGraphql, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

export const projects = [
    {   
        id: 1,
        image: "images/svg/tailwind.svg",
        title: "E-commerce Platform",
        description: "Developed a sophisticated trading bot using machine learning algorithms to analyze market patterns and execute automated trades with risk management strategies.",
        techs: [
            { name: "React", icon: FaReact, color: "#61DAFB" },
            { name: "Next.js", icon: SiNextdotjs, color: "000000" },
            { name: "Tailwind", icon: SiTailwindcss, color: "06B6D4" },
        ],
    },
    {
        id: 2,
        image: "images/svg/tailwind.svg",
        title: "Analytics Dashboard",
        description: "Real-time data visualization platform",
        techs: [
            { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
            { name: "D3.js", icon: SiD3Dotjs, color: "#F9A03C" },
            { name: "Node.js", icon: FaNode, color: "#339933" }
        ],
    },
    {
        id: 3,
        image: "images/svg/tailwind.svg",
        title: "Mobile Application",
        description: "Cross-platform mobile app for health tracking",
        techs: [
            { name: "React Native", icon: FaReact, color: "#61DAFB" },
            { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
            { name: "GraphQL", icon: SiGraphql, color: "#E535AB" }
        ],
    },
]
