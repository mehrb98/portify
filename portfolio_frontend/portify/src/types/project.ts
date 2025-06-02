import { IconType } from "react-icons";

interface ITech {
   name: string;
   icon: IconType;
   color: string;
}

export type IProjectCard = {
   id: number | string;
   image: string;
   title: string;
   description: string;
   techs: ITech[];
}