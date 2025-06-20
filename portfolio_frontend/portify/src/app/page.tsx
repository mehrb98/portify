import Hero from '../components/Hero/Hero';
import Projects from "../components/Project/Projects";
import Technology from "../components/Technology/Technology";
import SecondQuote from "../components/SecondQuote/SecondQuote";

export default function Home() {
   return (
      <>
         <Hero />
         <Technology />
         <SecondQuote/>
         <Projects/>
      </>
   )
};
