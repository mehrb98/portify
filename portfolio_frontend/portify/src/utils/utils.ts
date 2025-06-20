import * as Fa from "react-icons/fa6";
import * as Si from "react-icons/si";

export const iconMap = { ...Fa, ...Si };
export type IconName = keyof typeof iconMap;