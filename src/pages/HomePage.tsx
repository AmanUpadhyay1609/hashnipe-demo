import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { StatsSection } from '../components/sections/StatsSection';
import { FAQSection } from '../components/sections/FAQSection';
import { CTASection } from '../components/sections/CTASection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <FeaturesSection />
      </motion.div>
      
      <StatsSection />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <ProjectsSection />
      </motion.div>
      
      <FAQSection />
      <CTASection />
    </div>
  );
};