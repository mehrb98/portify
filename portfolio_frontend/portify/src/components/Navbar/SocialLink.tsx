"use client";

import { IconType } from "react-icons";
import { Button, Link } from '@heroui/react';

type SocialLinkProps = {
   link: string;
   icon: IconType;
}

export default function SocialLink({link, icon: Icon}: SocialLinkProps) {
   return (
      <div className="flex gap-3">
         <Button
            as={Link}
            href={link}
            color={"primary"}
            variant={"solid"}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className={"p-2 rounded-lg bg-white/5 hover:bg-primary/10 transition-colors group"}
         >
            <Icon className={"h-5 w-5 text-content/80 group-hover:text-primary transition-colors"} />
         </Button>
      </div>
   );
}
