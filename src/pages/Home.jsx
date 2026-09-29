import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Trust from '../components/Trust/Trust';
import Features from '../components/Features/Features';
import ExercisePreview from '../components/ExercisePreview/ExercisePreview';
import MuscleGroup from '../components/MuscleGroup/MuscleGroup';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import DashboardPreview from '../components/DashboardPreview/DashboardPreview';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';




export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [hash]);

  return (
    <>
      <Navbar />
      <Hero />
      <Trust />
      <Features />
      <ExercisePreview />
      <MuscleGroup />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}