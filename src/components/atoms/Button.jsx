import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  children,
  icon,
  iconPosition = "left",
  loading = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:scale-105",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 transform hover:scale-105",
    ghost: "text-slate-600 hover:text-primary-600 hover:bg-slate-50 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:scale-105"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    default: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
      ) : (
        icon && iconPosition === "left" && (
          <ApperIcon name={icon} className="w-4 h-4 mr-2" />
        )
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;