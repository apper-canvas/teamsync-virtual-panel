import { useState, useEffect } from 'react';
import timeTrackingService from '@/services/api/timeTrackingService';

export const useTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTimeEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeTrackingService.getAll();
      setTimeEntries(data);
      
      // Load current entry
      const current = await timeTrackingService.getCurrentEntry();
      setCurrentEntry(current);
    } catch (err) {
      setError(err.message);
      console.error('Error loading time entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async (employeeId = 1) => {
    try {
      const entry = await timeTrackingService.clockIn(employeeId);
      setCurrentEntry(entry);
      return entry;
    } catch (err) {
      console.error('Error clocking in:', err);
      throw err;
    }
  };

  const clockOut = async () => {
    try {
      const entry = await timeTrackingService.clockOut();
      setTimeEntries(prev => [entry, ...prev]);
      setCurrentEntry(null);
      return entry;
    } catch (err) {
      console.error('Error clocking out:', err);
      throw err;
    }
  };

  const getTodaysEntries = async () => {
    try {
      const entries = await timeTrackingService.getTodaysEntries();
      return entries;
    } catch (err) {
      console.error('Error getting today\'s entries:', err);
      throw err;
    }
  };

  const getWeeklyHours = async (employeeId = 1, weekStart = new Date()) => {
    try {
      const data = await timeTrackingService.getWeeklyHours(employeeId, weekStart);
      return data;
    } catch (err) {
      console.error('Error getting weekly hours:', err);
      throw err;
    }
  };

  const getByEmployeeId = async (employeeId) => {
    try {
      const entries = await timeTrackingService.getByEmployeeId(employeeId);
      return entries;
    } catch (err) {
      console.error('Error getting entries by employee:', err);
      throw err;
    }
  };

  const createTimeEntry = async (entryData) => {
    try {
      const newEntry = await timeTrackingService.create(entryData);
      setTimeEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('Error creating time entry:', err);
      throw err;
    }
  };

  const updateTimeEntry = async (id, entryData) => {
    try {
      const updatedEntry = await timeTrackingService.update(id, entryData);
      setTimeEntries(prev => 
        prev.map(entry => entry.Id === parseInt(id) ? updatedEntry : entry)
      );
      return updatedEntry;
    } catch (err) {
      console.error('Error updating time entry:', err);
      throw err;
    }
  };

  const deleteTimeEntry = async (id) => {
    try {
      await timeTrackingService.delete(id);
      setTimeEntries(prev => prev.filter(entry => entry.Id !== parseInt(id)));
    } catch (err) {
      console.error('Error deleting time entry:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadTimeEntries();
  }, []);

  return {
    timeEntries,
    currentEntry,
    loading,
    error,
    loadTimeEntries,
    clockIn,
    clockOut,
    getTodaysEntries,
    getWeeklyHours,
    getByEmployeeId,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry
  };
};