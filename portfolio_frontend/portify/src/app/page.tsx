import Navbar from "../components/Navbar/Navbar";
import Hero from '../components/Hero/Hero';
import Projects from "../components/Project/Projects";
import Technology from "../components/Technology/Technology";

export default function Home() {
   return (
      <>
         <Navbar />
         <Hero />
         <Technology />
         {/* <Projects/> */}
      </>
   )
};
