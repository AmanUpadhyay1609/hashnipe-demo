import React from 'react';
import { Hash, Github, Twitter, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-500 border-t border-dark-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Hash size={24} className="text-primary-400" />
              <span className="text-xl font-bold">
                <span className="text-primary-400">Ha</span>
                <span className="text-white">Shnipe</span>
              </span>
            </div>
            <p className="text-light-500 mb-6 max-w-md">
              Your intelligent AI sniper that analyzes and invests in the best AI agents on Virtual Protocol. Get early access to the most promising projects at the best possible moment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full hover:bg-dark-400 transition-colors text-light-500 hover:text-primary-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-dark-400 transition-colors text-light-500 hover:text-primary-400">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-dark-400 transition-colors text-light-500 hover:text-primary-400">
                <Globe size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-light-500 hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#features" className="text-light-500 hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#projects" className="text-light-500 hover:text-primary-400 transition-colors">Projects</a></li>
              <li><a href="#about" className="text-light-500 hover:text-primary-400 transition-colors">About</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-light-500 hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-light-500 hover:text-primary-400 transition-colors">Virtual Protocol</a></li>
              <li><a href="#" className="text-light-500 hover:text-primary-400 transition-colors">Base Blockchain</a></li>
              <li><a href="#" className="text-light-500 hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-300 mt-12 pt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-light-600 text-sm">© 2025 #HaShnipe Agent. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-light-600 hover:text-primary-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-light-600 hover:text-primary-400 text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};