import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const TimeClockWidget = ({ onClockIn, onClockOut, currentEntry }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsClockedIn(!!currentEntry && !currentEntry.clockOut);
  }, [currentEntry]);

  const handleClockAction = () => {
    if (isClockedIn) {
      onClockOut();
    } else {
      onClockIn();
    }
  };

  const formatTime = (date) => {
    return format(date, "HH:mm:ss");
  };

  const formatDate = (date) => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const calculateWorkedTime = () => {
    if (!currentEntry || !currentEntry.clockIn) return "00:00:00";
    
    const start = new Date(currentEntry.clockIn);
    const end = currentEntry.clockOut ? new Date(currentEntry.clockOut) : currentTime;
    const diff = end - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-premium p-8 text-center"
    >
      {/* Current Time Display */}
      <div className="mb-8">
        <div className="text-5xl font-bold gradient-text mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-lg text-slate-600">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Clock Status */}
      <div className="mb-8">
        {isClockedIn ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <ApperIcon name="Clock" className="w-5 h-5" />
              <span className="font-medium">You're clocked in</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Time worked today</div>
              <div className="text-2xl font-bold text-green-800">
                {calculateWorkedTime()}
              </div>
            </div>
            {currentEntry && (
              <div className="text-sm text-slate-600">
                Clocked in at {format(new Date(currentEntry.clockIn), "HH:mm")}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-slate-600">
              <ApperIcon name="ClockOff" className="w-5 h-5" />
              <span className="font-medium">You're clocked out</span>
            </div>
            {currentEntry && currentEntry.clockOut && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">Last session</div>
                <div className="text-lg font-semibold text-slate-800">
                  {format(new Date(currentEntry.clockIn), "HH:mm")} - {format(new Date(currentEntry.clockOut), "HH:mm")}
                </div>
                <div className="text-sm text-slate-600">
                  Total: {currentEntry.totalHours.toFixed(2)} hours
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clock Action Button */}
      <Button
        onClick={handleClockAction}
        variant={isClockedIn ? "danger" : "primary"}
        size="lg"
        className="text-lg px-8 py-4"
        icon={isClockedIn ? "LogOut" : "LogIn"}
      >
        {isClockedIn ? "Clock Out" : "Clock In"}
      </Button>
    </motion.div>
  );
};

export default TimeClockWidget;