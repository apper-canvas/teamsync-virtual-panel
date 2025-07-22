import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useEmployees } from "@/hooks/useEmployees";
import TimeClockWidget from "@/components/organisms/TimeClockWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { format, startOfWeek, addDays, isToday } from "date-fns";

const TimeEntryRow = ({ entry, employee }) => {
  const formatTime = (dateString) => {
    return format(new Date(dateString), "HH:mm");
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="hover:bg-slate-50 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "N/A"}
            </span>
          </div>
          <div>
            <div className="font-medium text-slate-800">
              {employee ? `${employee.firstName} ${employee.lastName}` : `Employee #${entry.employeeId}`}
            </div>
            <div className="text-sm text-slate-500">
              {employee?.role || "Unknown Role"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isToday(new Date(entry.date)) ? "bg-green-500" : "bg-slate-300"}`} />
          <span className="text-sm text-slate-700">
            {format(new Date(entry.date), "MMM d, yyyy")}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 text-green-600">
          <ApperIcon name="LogIn" className="w-4 h-4" />
          <span className="font-medium">{formatTime(entry.clockIn)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {entry.clockOut ? (
          <div className="flex items-center space-x-2 text-red-600">
            <ApperIcon name="LogOut" className="w-4 h-4" />
            <span className="font-medium">{formatTime(entry.clockOut)}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-orange-600">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span className="font-medium">Active</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-right">
          <div className="font-semibold text-slate-800">
            {formatDuration(entry.totalHours)}
          </div>
          {entry.totalHours >= 8 && (
            <div className="text-xs text-green-600 mt-1">Full Day</div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

const WeeklyHoursCard = ({ employee, totalHours, entries }) => {
  const hoursGoal = 40; // Standard work week
  const percentage = Math.min((totalHours / hoursGoal) * 100, 100);
  
  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-premium p-6"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "ME"}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800">
            {employee ? `${employee.firstName} ${employee.lastName}` : "Current User"}
          </h3>
          <p className="text-slate-600 text-sm">This Week's Hours</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Hours Display */}
        <div className="text-center">
          <div className="text-4xl font-bold gradient-text mb-1">
            {formatDuration(totalHours)}
          </div>
          <div className="text-slate-600">
            of {hoursGoal}h goal
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-800">{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-3 rounded-full ${
                percentage >= 100 ? "bg-gradient-to-r from-green-500 to-green-600" :
                percentage >= 75 ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                "bg-gradient-to-r from-orange-500 to-orange-600"
              }`}
            />
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">Daily Breakdown</h4>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
              const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
              const dayDate = addDays(weekStart, index);
              const dayEntry = entries.find(entry => 
                format(new Date(entry.date), "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd")
              );
              
              return (
                <div key={day} className="text-center">
                  <div className="text-slate-500 mb-1">{day}</div>
                  <div className={`w-8 h-8 rounded mx-auto flex items-center justify-center text-xs font-medium ${
                    dayEntry 
                      ? "bg-primary-100 text-primary-800" 
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {dayEntry ? Math.round(dayEntry.totalHours) : "-"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TimeTracking = () => {
  const { 
    timeEntries, 
    currentEntry, 
    loading, 
    error, 
    clockIn, 
    clockOut, 
    getTodaysEntries,
    getWeeklyHours 
  } = useTimeTracking();
  
  const { employees, loading: employeesLoading } = useEmployees();
  
  const [todaysEntries, setTodaysEntries] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    loadTodaysEntries();
    loadWeeklyData();
  }, []);

  const loadTodaysEntries = async () => {
    try {
      const entries = await getTodaysEntries();
      setTodaysEntries(entries);
    } catch (err) {
      console.error("Error loading today's entries:", err);
    }
  };

  const loadWeeklyData = async () => {
    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const data = await getWeeklyHours(weekStart);
      setWeeklyData(data);
    } catch (err) {
      console.error("Error loading weekly data:", err);
    }
  };

  const handleClockIn = async () => {
    try {
      await clockIn();
      toast.success("Clocked in successfully!");
      loadTodaysEntries();
    } catch (err) {
      toast.error(err.message || "Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut();
      toast.success("Clocked out successfully!");
      loadTodaysEntries();
      loadWeeklyData();
    } catch (err) {
      toast.error(err.message || "Failed to clock out");
    }
  };

  const getEmployeeById = (employeeId) => {
    return employees.find(emp => emp.Id === employeeId);
  };

  const currentEmployee = getEmployeeById(1); // Assuming current user ID is 1

  if (loading || employeesLoading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-4">Time Tracking</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Track work hours, monitor attendance, and manage time effectively
        </p>
      </div>

      {/* Time Clock and Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Clock Widget */}
        <div>
          <TimeClockWidget 
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            currentEntry={currentEntry}
          />
        </div>

        {/* Weekly Hours Summary */}
        <div>
          {weeklyData && (
            <WeeklyHoursCard 
              employee={currentEmployee}
              totalHours={weeklyData.totalHours}
              entries={weeklyData.entries}
            />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "today"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Today's Activity
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "all"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            All Records
          </button>
        </div>

        {/* Time Entries Table */}
        <div className="overflow-x-auto">
          {activeTab === "today" ? (
            todaysEntries.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Employee</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Clock In</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Clock Out</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Total Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todaysEntries.map((entry) => (
                    <TimeEntryRow 
                      key={entry.Id}
                      entry={entry}
                      employee={getEmployeeById(entry.employeeId)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty
                title="No activity today"
                description="Clock in to start tracking your time for today."
                icon="Clock"
                action={currentEntry ? undefined : handleClockIn}
                actionLabel="Clock In"
              />
            )
          ) : (
            timeEntries.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Employee</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Clock In</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Clock Out</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Total Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {timeEntries.slice().reverse().slice(0, 20).map((entry) => (
                    <TimeEntryRow 
                      key={entry.Id}
                      entry={entry}
                      employee={getEmployeeById(entry.employeeId)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty
                title="No time records found"
                description="Start tracking time to see records here."
                icon="Clock"
              />
            )
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Clock" className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {todaysEntries.length}
          </div>
          <div className="text-slate-600">Today's Check-ins</div>
        </div>

        <div className="card-premium p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {weeklyData ? Math.round(weeklyData.totalHours) : 0}h
          </div>
          <div className="text-slate-600">This Week</div>
        </div>

        <div className="card-premium p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {timeEntries.length}
          </div>
          <div className="text-slate-600">Total Records</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeTracking;