import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import DashboardStats from "@/components/organisms/DashboardStats";
import TimeClockWidget from "@/components/organisms/TimeClockWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const RecentActivity = ({ employees }) => {
  const recentActivities = [
    {
      id: 1,
      type: "new_employee",
      message: "John Smith joined the Engineering team",
      time: "2 hours ago",
      icon: "UserPlus",
      color: "text-green-600"
    },
    {
      id: 2,
      type: "time_off",
      message: "Sarah Davis requested time off",
      time: "4 hours ago",
      icon: "Calendar",
      color: "text-yellow-600"
    },
    {
      id: 3,
      type: "department",
      message: "New department created: Finance",
      time: "1 day ago",
      icon: "Building2",
      color: "text-blue-600"
    },
    {
      id: 4,
      type: "clock_in",
      message: "85% attendance rate today",
      time: "2 days ago",
      icon: "Clock",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Recent Activity</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-3 hover:bg-slate-50/50 rounded-lg transition-colors"
          >
            <div className={`p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg ${activity.color}`}>
              <ApperIcon name={activity.icon} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 font-medium">
                {activity.message}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TodayAttendance = () => {
  const [todayEntries, setTodayEntries] = useState([]);
  const { getTodaysEntries } = useTimeTracking();

  useEffect(() => {
    const loadTodayEntries = async () => {
      try {
        const entries = await getTodaysEntries();
        setTodayEntries(entries);
      } catch (err) {
        console.error("Error loading today's entries:", err);
      }
    };

    loadTodayEntries();
  }, []);

  const attendanceRate = todayEntries.length > 0 ? 
    Math.round((todayEntries.length / 8) * 100) : 0; // Assuming 8 total employees

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Today's Attendance</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            attendanceRate >= 80 ? "bg-green-500" : 
            attendanceRate >= 60 ? "bg-yellow-500" : "bg-red-500"
          }`} />
          <span className="text-sm font-medium text-slate-600">
            {attendanceRate}% Present
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {todayEntries.slice(0, 5).map((entry, index) => (
          <motion.div
            key={entry.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-slate-800">
                Employee #{entry.employeeId}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-800">
                {format(new Date(entry.clockIn), "HH:mm")}
              </div>
              <div className="text-xs text-slate-500">
                Clock In
              </div>
            </div>
          </motion.div>
        ))}

        {todayEntries.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <ApperIcon name="Users" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No attendance records for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { clockIn, clockOut, currentEntry, error: timeError } = useTimeTracking();

  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
if (!employeesLoading && !departmentsLoading) {
      const activeEmployees = employees.filter(emp => emp.status_c === "active");
      const onLeaveEmployees = employees.filter(emp => emp.status_c === "on-leave");
      
      setDashboardStats([
        {
          title: "Total Employees",
          value: employees.length.toString(),
          icon: "Users",
          change: "+2",
          changeType: "increase",
          color: "primary"
        },
        {
          title: "Departments",
          value: departments.length.toString(),
          icon: "Building2",
          change: null,
          changeType: "increase",
          color: "success"
        },
        {
          title: "Present Today",
          value: Math.max(0, activeEmployees.length - 2).toString(),
          icon: "UserCheck",
          change: "85%",
          changeType: "increase",
          color: "info"
        },
        {
          title: "On Leave",
          value: onLeaveEmployees.length.toString(),
          icon: "UserMinus",
          change: null,
          changeType: "decrease",
          color: "warning"
        }
      ]);
    }
  }, [employees, departments, employeesLoading, departmentsLoading]);

  const handleClockIn = async () => {
    try {
      await clockIn();
      toast.success("Clocked in successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut();
      toast.success("Clocked out successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to clock out");
    }
  };

  if (employeesLoading || departmentsLoading) {
    return <Loading type="dashboard" />;
  }

  if (employeesError) {
    return (
      <Error 
        message={employeesError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Welcome to TeamSync
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Streamline your employee management with our comprehensive dashboard. 
          Track attendance, manage departments, and keep your team organized.
        </p>
      </div>

      {/* Stats Overview */}
      {dashboardStats && <DashboardStats stats={dashboardStats} />}

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Time Clock Widget */}
        <div className="lg:col-span-1">
          <TimeClockWidget 
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            currentEntry={currentEntry}
          />
          {timeError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{timeError}</p>
            </div>
          )}
        </div>

        {/* Today's Attendance */}
        <div className="lg:col-span-1">
          <TodayAttendance />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity employees={employees} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
        <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center group"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ApperIcon name="UserPlus" className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Add Employee</h3>
            <p className="text-sm text-slate-600">Register a new team member</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center group"
          >
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ApperIcon name="Building2" className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Manage Departments</h3>
            <p className="text-sm text-slate-600">Organize your teams</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center group"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Time Tracking</h3>
            <p className="text-sm text-slate-600">Monitor work hours</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;