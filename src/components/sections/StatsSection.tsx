import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bot, LineChart, TrendingUp, Users } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subtext?: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subtext, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-dark-300/60 backdrop-blur-md border border-dark-100 rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</h3>
          <p className="text-light-400 text-sm">{label}</p>
          {subtext && <p className="text-primary-400 text-xs mt-2">{subtext}</p>}
        </div>
        <div className="bg-primary-500/10 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-400 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[linear-gradient(45deg,transparent,rgba(14,165,233,0.1)_25%,transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Bot size={24} className="text-primary-400" />}
            value="100+"
            label="AI Agents Analyzed"
            subtext="Since launch"
            delay={0.1}
          />
          <StatCard
            icon={<Users size={24} className="text-primary-400" />}
            value="5,600+"
            label="Active Users"
            subtext="Growing community"
            delay={0.2}
          />
          <StatCard
            icon={<TrendingUp size={24} className="text-primary-400" />}
            value="86%"
            label="Investment Success Rate"
            subtext="Above threshold ROI"
            delay={0.3}
          />
          <StatCard
            icon={<LineChart size={24} className="text-primary-400" />}
            value="$2.4M+"
            label="Total Value Invested"
            subtext="Through our platform"
            delay={0.4}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="inline-flex items-center text-primary-400 font-medium">
            <span>View all statistics</span>
            <ArrowUpRight size={16} className="ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};