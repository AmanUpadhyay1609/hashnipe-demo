import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      className="border border-dark-100 rounded-lg overflow-hidden"
    >
      <button
        className="flex items-center justify-between w-full p-5 text-left bg-dark-300/60 hover:bg-dark-300 transition-colors"
        onClick={onClick}
      >
        <h3 className="text-lg font-medium text-white">{faq.question}</h3>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus size={20} className="text-primary-400" />
          ) : (
            <Plus size={20} className="text-primary-400" />
          )}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 bg-dark-400 border-t border-dark-100">
          <p className="text-light-400">{faq.answer}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs: FAQ[] = [
    {
      question: "What is #HaShnipe Agent?",
      answer: "#HaShnipe Agent is an intelligent AI tool designed for smart investment in AI agents on the Virtual Protocol platform. It analyzes various factors to identify the best projects to subscribe to or snipe at launch."
    },
    {
      question: "How does the scoring system work?",
      answer: "Our proprietary scoring system analyzes multiple private factors including project fundamentals, team background, community engagement, token metrics, and market conditions. Based on these factors, each project receives a score that determines whether it's best to subscribe or snipe."
    },
    {
      question: "What happens when a project is flagged as 'best to snipe'?",
      answer: "When a project is identified as 'best to snipe', the #HaShnipe Agent intelligently snipes the token at its launch to the bonding pool, ensuring you get in at the earliest possible blocks with the best potential returns."
    },
    {
      question: "Do I need to manually monitor projects?",
      answer: "No, the #HaShnipe Agent does the monitoring for you. It continuously analyzes all Genesis Launches on Virtual Protocol and automatically flags the best opportunities based on your investment criteria."
    },
    {
      question: "Is there a guarantee of returns?",
      answer: "While our AI scoring system has demonstrated a high success rate, all investments carry risk. The #HaShnipe Agent provides intelligence to make informed decisions, but cannot guarantee returns as market conditions can change rapidly."
    },
    {
      question: "How do I get started with #HaShnipe Agent?",
      answer: "To get started, connect your wallet to the platform, set your investment preferences, and the agent will begin analyzing projects based on your criteria. You can then choose to follow its recommendations or make manual investment decisions."
    }
  ];
  
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className="py-24 bg-dark-400">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-light-400 max-w-2xl mx-auto">
            Get answers to common questions about #HaShnipe Agent and how it can help with your AI agent investments.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};