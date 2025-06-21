import { IconName } from "@/utils/utils";

export interface ITech {
   name: string;
   color: string;
   icon: IconName;
}

export interface IProjectLink {
   url: string;
   title: string;
}

interface IProject {
   title: string;
   date: string;
   techs: ITech[];
   images_src: string;
   description: string;
   links: IProjectLink[];
   full_description: string;
}

export interface IProjectCard extends IProject {
   slug: string;
   image: string;
}

export type IProjectContent = Partial<IProject>;
