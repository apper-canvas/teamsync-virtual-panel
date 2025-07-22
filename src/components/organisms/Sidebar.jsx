import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/employees", icon: "Users", label: "Employees" },
    { path: "/departments", icon: "Building2", label: "Departments" },
    { path: "/time-tracking", icon: "Clock", label: "Time Tracking" }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">TeamSync</h2>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            >
              <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={isMobile ? onClose : undefined}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-primary-600"
                  }`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-primary-600"
                    }`} 
                  />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200/50">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">HR Manager</p>
              <p className="text-xs text-slate-500">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* Mobile sidebar */}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed left-0 top-0 h-full w-80 z-50 lg:hidden"
        >
          {sidebarContent}
        </motion.aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden lg:block w-80 h-screen sticky top-0">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;