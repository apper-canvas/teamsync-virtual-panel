import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";

const EmployeeCard = ({ employee, onEdit, onView, onDelete }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card p-6"
    >
      {/* Header with Photo and Basic Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          {employee.photoUrl ? (
            <img
              src={employee.photoUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <span className="text-white font-semibold text-lg">
                {getInitials(employee.firstName, employee.lastName)}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1">
            <StatusBadge status={employee.status} />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-slate-800">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-primary-600 font-medium">{employee.role}</p>
          <p className="text-slate-500 text-sm">{employee.department}</p>
        </div>

        {/* Actions Dropdown */}
        <div className="relative group">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ApperIcon name="MoreVertical" className="w-4 h-4 text-slate-400" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <button
              onClick={() => onView(employee)}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <ApperIcon name="Eye" className="w-4 h-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => onEdit(employee)}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(employee)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600">
          <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
          <span>Joined {new Date(employee.hireDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(employee)}
          className="flex-1"
        >
          View Profile
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(employee)}
        >
          <ApperIcon name="Edit" className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;