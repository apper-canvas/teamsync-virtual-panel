import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import leaveRequestService from "@/services/api/leaveRequestService";
const Header = ({ onMenuClick, onSearch, title = "Dashboard" }) => {
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New employee John Smith has been added", time: "2 min ago" },
    { id: 2, message: "Department meeting scheduled for 3 PM", time: "1 hour ago" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([]);

  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
const requests = await leaveRequestService.getAll();
        const pending = requests.filter(req => req.status_c === 'pending');
        setPendingLeaveRequests(pending);
        
        // Add leave request notifications
        const leaveNotifications = pending.map(req => ({
          id: `leave-${req.Id}`,
          message: `${req.employee_name_c} requested ${req.leave_type_c} leave`,
          time: new Date(req.created_at_c).toLocaleDateString(),
          type: 'leave-request',
          requestId: req.Id
        }));
        
        setNotifications(prev => [
          ...leaveNotifications,
          ...prev.filter(n => !n.type || n.type !== 'leave-request')
        ]);
      } catch (error) {
        console.error('Failed to load pending requests:', error);
      }
    };

    loadPendingRequests();
  }, []);
  return (
    <header
    className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 sticky top-0 z-30">
    <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
            <button
                onClick={onMenuClick}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
                <ApperIcon name="Menu" className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        </div>
        {/* Center - Search */}
        {onSearch && <div className="flex-1 max-w-md mx-8">
            <SearchBar
                onSearch={onSearch}
                placeholder="Search employees, departments..."
                className="w-full" />
        </div>}
        {/* Right side */}
        <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
                <Button
                    variant="ghost"
                    className="relative p-2"
                    onClick={() => setShowNotifications(!showNotifications)}>
                    <ApperIcon name="Bell" className="w-5 h-5" />
                    {notifications.length > 0 && <span
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                    </span>}
                </Button>
                {/* Notification Dropdown */}
                {showNotifications && <div
                    className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {notifications.length === 0 ? <div className="p-4 text-center text-slate-500">
                            <ApperIcon name="Bell" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p>No notifications</p>
                        </div> : notifications.map(
                            notification => <div key={notification.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <ApperIcon
                                            name={notification.type === "leave-request" ? "Calendar" : "Bell"}
                                            className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 font-medium">{notification.message}</p>
                                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                                        {notification.type === "leave-request" && <div className="flex space-x-2 mt-2">
                                            <Button size="sm" variant="primary" className="text-xs px-2 py-1">Review
                                                                                </Button>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>}
            </div>
            {/* Quick Actions */}
            <Button variant="primary" size="sm" icon="Plus">Add Employee
                          </Button>
            {/* User Menu */}
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                <div
                    className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-800">HR Manager</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <Button
variant="ghost"
                    size="sm"
                    onClick={() => {
                        logout();
                    }}
                    className="text-slate-600 hover:text-red-600">
                    <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />Logout
                                </Button>
            </div>
<Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    logout();
                }}
                className="text-slate-600 hover:text-red-600">
                <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />Logout
                            </Button>
        </div>
    </div>
</header>
  );
};