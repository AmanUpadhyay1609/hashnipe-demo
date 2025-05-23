import React from 'react';
import { Clock } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center text-center shadow-xl">
      <div className="bg-gray-700 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
        <Clock className="w-8 h-8 sm:w-12 sm:h-12 bg-none" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-400 max-w-md">{description}</p>
      <button className="mt-4 sm:mt-6 px-4 sm:px-5 py-1.5 sm:py-2 bg-primary-500 hover:bg-primary-700 transition-colors rounded-md text-sm sm:text-base text-white font-medium">
        Get Notified
      </button>
    </div>
  );
};

export default EmptyState;