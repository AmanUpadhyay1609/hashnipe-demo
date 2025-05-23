import React from 'react';
import { Clock } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-xl">
      <div className="bg-gray-700 p-4 rounded-full mb-4">
        <Clock className="w-12 h-12 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md">{description}</p>
      <button className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md text-white font-medium">
        Get Notified
      </button>
    </div>
  );
};

export default EmptyState;