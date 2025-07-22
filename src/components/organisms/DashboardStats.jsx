import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, change, changeType, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    info: "from-blue-500 to-blue-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${
            changeType === "increase" ? "text-green-600" : "text-red-600"
          }`}>
            <ApperIcon 
              name={changeType === "increase" ? "TrendingUp" : "TrendingDown"} 
              className="w-4 h-4" 
            />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold gradient-text mb-1">{value}</h3>
        <p className="text-slate-600 font-medium">{title}</p>
      </div>
    </motion.div>
  );
};

const DashboardStats = ({ stats }) => {
  const defaultStats = [
    {
      title: "Total Employees",
      value: "0",
      icon: "Users",
      change: null,
      changeType: "increase",
      color: "primary"
    },
    {
      title: "Departments",
      value: "0",
      icon: "Building2",
      change: null,
      changeType: "increase",
      color: "success"
    },
    {
      title: "Present Today",
      value: "0",
      icon: "UserCheck",
      change: null,
      changeType: "increase",
      color: "info"
    },
    {
      title: "On Leave",
      value: "0",
      icon: "UserMinus",
      change: null,
      changeType: "decrease",
      color: "warning"
    }
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;