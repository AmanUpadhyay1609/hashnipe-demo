import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, BarChart as ChartBar, Clock, DatabaseBackup, Filter, LineChart, Share2 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="card card-hover group p-6"
    >
      <div className="flex flex-col h-full">
        <div className="bg-primary-500/10 p-3 rounded-lg w-fit mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-light-400 flex-grow mb-4">{description}</p>
        <div className="flex items-center text-primary-400 text-sm font-medium">
          <span>Learn more</span>
          <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain size={24} className="text-primary-400" />,
      title: "AI-Powered Analysis",
      description: "Our agent uses advanced AI algorithms to analyze multiple factors and identify the most promising AI agent investments.",
      delay: 0.1
    },
    {
      icon: <ChartBar size={24} className="text-primary-400" />,
      title: "Smart Scoring System",
      description: "Each project receives a proprietary score based on multiple private factors to determine investment potential.",
      delay: 0.2
    },
    {
      icon: <Clock size={24} className="text-primary-400" />,
      title: "Early Block Sniping",
      description: "Get in on the ground floor with intelligent token sniping at launch, targeting the earliest possible blocks.",
      delay: 0.3
    },
    {
      icon: <Filter size={24} className="text-primary-400" />,
      title: "Custom Investment Filters",
      description: "Set your investment criteria and let HaShnipe Agent filter projects that match your specific requirements.",
      delay: 0.4
    },
    {
      icon: <LineChart size={24} className="text-primary-400" />,
      title: "Real-Time Performance Tracking",
      description: "Monitor the performance of sniped tokens with real-time data and analytics dashboards.",
      delay: 0.5
    },
    {
      icon: <DatabaseBackup size={24} className="text-primary-400" />,
      title: "Automatic Genesis Participation",
      description: "Automatically participate in Genesis Launches that meet your investment criteria without manual intervention.",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="py-24 bg-dark-400">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">AI-Powered</span> Investment Features
            </h2>
            <p className="text-light-400 max-w-2xl mx-auto">
              #HaShnipe Agent combines advanced AI with deep blockchain analytics to help you invest smarter in Virtual Protocol's AI agent marketplace.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};