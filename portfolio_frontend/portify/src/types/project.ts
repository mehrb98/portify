import { IconType } from "react-icons";

interface ITech {
   name: string;
   color: string;
   icon: IconType;
}

export type IProjectCard = {
   id: number | string;
   image: string;
   title: string;
   description: string;
   techs: ITech[];
}