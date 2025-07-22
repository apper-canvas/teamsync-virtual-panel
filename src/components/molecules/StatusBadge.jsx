import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      variant: "success",
      icon: "CheckCircle",
      label: "Active"
    },
    inactive: {
      variant: "error",
      icon: "XCircle",
      label: "Inactive"
    },
    "on-leave": {
      variant: "warning",
      icon: "Clock",
      label: "On Leave"
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <ApperIcon name={config.icon} className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default StatusBadge;