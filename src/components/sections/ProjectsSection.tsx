import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGenesis, GenesisLaunch, StatusFilter } from '../../context/GenesisContext';
import { ProjectCard } from '../ui/ProjectCard';
import {  Zap, Clock, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectsSection: React.FC = () => {
  const { 
    activeProjects, 
    endedProjects, 
    upcomingProjects, 
    topSnipeProjects, 
    loading, 
    error 
  } = useGenesis();
  
  const [filter, setFilter] = useState<StatusFilter>('active');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 6;

  // Get the correct project list based on filter
  const getFilteredProjects = () => {
    switch(filter) {
      case 'active': return activeProjects;
      case 'ended': return endedProjects;
      case 'upcoming': return upcomingProjects;
      case 'top-snipe': return topSnipeProjects;
      default: return activeProjects;
    }
  };

  // Filter projects based on search term
  const filteredProjects = getFilteredProjects().filter(project => {
    const matchesSearch = 
      project.virtual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.virtual.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.virtual.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Get current projects for pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section id="projects" className="py-24 bg-dark-500">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Genesis Launches</span> Opportunities
          </h2>
          <p className="text-light-400 max-w-2xl mx-auto">
            Discover and analyze the latest AI agent launches on Virtual Protocol. Our intelligent scoring system helps you identify the best investment opportunities.
          </p>
        </motion.div>

        {/* Featured Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-4 scrollbar-hide">
          <div 
            className={`flex-shrink-0 w-64 md:w-72 p-4 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              filter === 'top-snipe' 
                ? 'bg-primary-500/30 border border-primary-500/60' 
                : 'bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20'
            }`}
            onClick={() => setFilter('top-snipe')}
          >
            <div className="text-center">
              <Zap size={24} className="text-primary-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">Top Snipe Picks</h3>
              <p className="text-light-400 text-sm">Best projects to snipe at launch</p>
            </div>
          </div>
          
          <div 
            className={`flex-shrink-0 w-64 md:w-72 p-4 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              filter === 'active' 
                ? 'bg-info-500/30 border border-info-500/60' 
                : 'bg-info-500/10 border border-info-500/20 hover:bg-info-500/20'
            }`}
            onClick={() => setFilter('active')}
          >
            <div className="text-center">
              <Clock size={24} className="text-info-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">Active</h3>
              <p className="text-light-400 text-sm">Currently open for investments</p>
            </div>
          </div>
          
          <div 
            className={`flex-shrink-0 w-64 md:w-72 p-4 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              filter === 'ended' 
                ? 'bg-secondary-500/30 border border-secondary-500/60' 
                : 'bg-secondary-500/10 border border-secondary-500/20 hover:bg-secondary-500/20'
            }`}
            onClick={() => setFilter('ended')}
          >
            <div className="text-center">
              <CheckCircle size={24} className="text-secondary-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">Ended</h3>
              <p className="text-light-400 text-sm">Past launches and their outcomes</p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-error-500 p-8 bg-error-500/10 rounded-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project: GenesisLaunch) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProjects.length > projectsPerPage && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md">
              <button
                className="px-3 py-2 rounded-l-md border border-dark-100 bg-dark-300 text-light-300 hover:bg-dark-200"
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                let pageNumber = currentPage - 2 + index;
                
                if (currentPage < 3) {
                  pageNumber = index + 1;
                } else if (currentPage > totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                }
                
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 border border-dark-100 ${
                        currentPage === pageNumber
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-300 text-light-300 hover:bg-dark-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                className="px-3 py-2 rounded-r-md border border-dark-100 bg-dark-300 text-light-300 hover:bg-dark-200"
                onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        )}

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link 
            to="/tokens" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-colors"
          >
            View All Tokens
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};