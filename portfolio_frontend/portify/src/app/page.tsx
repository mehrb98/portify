import Hero from '../components/Hero/Hero';
import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import Projects from "../components/Project/Projects";
import Technology from "../components/Technology/Technology";
import SecondQuote from "../components/SecondQuote/SecondQuote";

export default function Home() {
   return (
      <>
         <Navbar />
         <Hero />
         <Technology />
         <SecondQuote/>
         <Projects/>
         <Footer/>
      </>
   )
};
