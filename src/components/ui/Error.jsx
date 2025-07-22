import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          className="w-12 h-12 text-red-500" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
        Oops! Something went wrong
      </h3>
      
      <p className="text-slate-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  );
};

export default Error;