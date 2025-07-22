import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "FileX",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-full mb-6">
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-slate-400" 
        />
      </div>
      
      <h3 className="text-2xl font-bold gradient-text mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-slate-600 text-center mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {action && (
        <motion.button
          onClick={action}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;