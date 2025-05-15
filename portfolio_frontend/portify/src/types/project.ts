export interface IProjectCard {
   title: string;
   description: string;
   date: string;
   imageUrl: string;
   tags: string[];
   slug: string;
   links: { 
      title: string; 
      url: string 
   }[];
}