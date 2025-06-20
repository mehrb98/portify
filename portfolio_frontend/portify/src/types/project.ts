import { IconName } from "@/utils/utils";

export interface ITech {
   name: string;
   color: string;
   icon: IconName;
}

export type IProjectCard = {
   id: number | string;
   image: string;
   title: string;
   description: string;
   techs: ITech[];
}