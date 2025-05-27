export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'STARTED':
            return <div className="flex items-center space-x-1.5">
                <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-success-400"></div>
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-success-400 animate-ping opacity-75"></div>
                </div>
                <span className="text-xs font-medium text-success-400">Live</span>
            </div>;
        case 'INITIALIZED':
            return <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-warning-400"></div>
                <span className="text-xs font-medium text-warning-400">Upcoming</span>
            </div>;
        case 'FINALIZED':
            return <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                <span className="text-xs font-medium text-primary-400">Ended</span>
            </div>;
        case 'FAILED':
            return <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-error-400"></div>
                <span className="text-xs font-medium text-error-400">Failed</span>
            </div>;
        default:
            return <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-light-400"></div>
                <span className="text-xs font-medium text-light-400">Unknown</span>
            </div>;
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'STARTED':
            return 'bg-success-500/10 border-success-500/20';
        case 'INITIALIZED':
            return 'bg-warning-500/10 border-warning-500/20';
        case 'FINALIZED':
            return 'bg-primary-500/10 border-primary-500/20';
        case 'FAILED':
            return 'bg-error-500/10 border-error-500/20';
        default:
            return 'bg-light-500/10 border-light-500/20';
    }
};