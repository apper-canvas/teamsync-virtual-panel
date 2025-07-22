import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, onSearch, title = "Dashboard" }) => {
  const [notifications] = useState([
    { id: 1, message: "New employee John Smith has been added", time: "2 min ago" },
    { id: 2, message: "Department meeting scheduled for 3 PM", time: "1 hour ago" }
  ]);

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        </div>

        {/* Center - Search */}
        {onSearch && (
          <div className="flex-1 max-w-md mx-8">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search employees, departments..."
              className="w-full"
            />
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" className="relative p-2">
              <ApperIcon name="Bell" className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <Button variant="primary" size="sm" icon="Plus">
            Add Employee
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">HR Manager</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;