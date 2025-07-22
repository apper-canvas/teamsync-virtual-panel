import { useState, useEffect } from "react";
import timeTrackingService from "@/services/api/timeTrackingService";

export const useTimeTracking = (employeeId = 1) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTimeEntries = async () => {
    try {
      setLoading(true);
      setError("");
      const [entries, current] = await Promise.all([
        timeTrackingService.getByEmployeeId(employeeId),
        timeTrackingService.getCurrentEntry()
      ]);
      setTimeEntries(entries);
      setCurrentEntry(current);
    } catch (err) {
      setError("Failed to load time entries. Please try again.");
      console.error("Error loading time entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async () => {
    try {
      setError("");
      const entry = await timeTrackingService.clockIn(employeeId);
      setCurrentEntry(entry);
      return entry;
    } catch (err) {
      setError("Failed to clock in. Please try again.");
      console.error("Error clocking in:", err);
      throw err;
    }
  };

  const clockOut = async () => {
    try {
      setError("");
      const entry = await timeTrackingService.clockOut();
      setTimeEntries(prev => [...prev, entry]);
      setCurrentEntry(null);
      return entry;
    } catch (err) {
      setError("Failed to clock out. Please try again.");
      console.error("Error clocking out:", err);
      throw err;
    }
  };

  const getTodaysEntries = async () => {
    try {
      setError("");
      const entries = await timeTrackingService.getTodaysEntries();
      return entries;
    } catch (err) {
      setError("Failed to load today's entries. Please try again.");
      console.error("Error loading today's entries:", err);
      throw err;
    }
  };

  const getWeeklyHours = async (weekStart) => {
    try {
      setError("");
      const data = await timeTrackingService.getWeeklyHours(employeeId, weekStart);
      return data;
    } catch (err) {
      setError("Failed to load weekly hours. Please try again.");
      console.error("Error loading weekly hours:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadTimeEntries();
  }, [employeeId]);

  return {
    timeEntries,
    currentEntry,
    loading,
    error,
    loadTimeEntries,
    clockIn,
    clockOut,
    getTodaysEntries,
    getWeeklyHours
  };
};