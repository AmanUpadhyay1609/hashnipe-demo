import { motion } from 'framer-motion'
export const GhostForm = () => (
    <motion.div
        key="ghost"
        className="w-full lg:w-96 lg:sticky lg:top-6 self-start animate-pulse space-y-4 p-4 bg-dark-400 border border-dark-300 rounded-xl"
    >
        <div className="h-6 bg-dark-300 rounded w-2/3" />
        <div className="h-10 bg-dark-300 rounded w-full" />
        <div className="h-10 bg-dark-300 rounded w-full" />
        <div className="flex justify-end">
            <div className="h-10 w-24 bg-dark-300 rounded" />
        </div>
    </motion.div>
);
