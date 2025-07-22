import timeEntriesData from "@/services/mockData/timeEntries.json";
import { format } from "date-fns";

class TimeTrackingService {
  constructor() {
    this.timeEntries = [...timeEntriesData];
    this.currentEntry = null;
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.timeEntries];
  }

  async getByEmployeeId(employeeId) {
    await this.delay();
    return this.timeEntries.filter(entry => entry.employeeId === parseInt(employeeId));
  }

  async getTodaysEntries() {
    await this.delay();
    const today = format(new Date(), "yyyy-MM-dd");
    return this.timeEntries.filter(entry => entry.date === today);
  }

  async getCurrentEntry() {
    await this.delay(100);
    return this.currentEntry ? { ...this.currentEntry } : null;
  }

  async clockIn(employeeId = 1) {
    await this.delay(200);
    
    // Check if already clocked in
    if (this.currentEntry && !this.currentEntry.clockOut) {
      throw new Error("Already clocked in");
    }
    
    const now = new Date();
    const entry = {
      Id: Math.max(...this.timeEntries.map(entry => entry.Id), 0) + 1,
      employeeId: parseInt(employeeId),
      clockIn: now.toISOString(),
      clockOut: null,
      totalHours: 0,
      date: format(now, "yyyy-MM-dd")
    };
    
    this.currentEntry = { ...entry };
    return { ...entry };
  }

  async clockOut() {
    await this.delay(200);
    
    if (!this.currentEntry || this.currentEntry.clockOut) {
      throw new Error("Not currently clocked in");
    }
    
    const now = new Date();
    const clockInTime = new Date(this.currentEntry.clockIn);
    const totalHours = (now - clockInTime) / (1000 * 60 * 60); // Convert to hours
    
    this.currentEntry.clockOut = now.toISOString();
    this.currentEntry.totalHours = parseFloat(totalHours.toFixed(2));
    
    // Add to time entries
    this.timeEntries.push({ ...this.currentEntry });
    
    const completedEntry = { ...this.currentEntry };
    this.currentEntry = null;
    
    return completedEntry;
  }

  async getWeeklyHours(employeeId, weekStart) {
    await this.delay(200);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const entries = this.timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.employeeId === parseInt(employeeId) &&
             entryDate >= weekStart &&
             entryDate <= weekEnd;
    });
    
    const totalHours = entries.reduce((sum, entry) => sum + entry.totalHours, 0);
    
    return {
      entries,
      totalHours: parseFloat(totalHours.toFixed(2)),
      weekStart: format(weekStart, "yyyy-MM-dd"),
      weekEnd: format(weekEnd, "yyyy-MM-dd")
    };
  }

  async create(timeEntryData) {
    await this.delay(400);
    
    const newEntry = {
      ...timeEntryData,
      Id: Math.max(...this.timeEntries.map(entry => entry.Id), 0) + 1
    };
    
    this.timeEntries.push(newEntry);
    return { ...newEntry };
  }

  async update(id, timeEntryData) {
    await this.delay(400);
    
    const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time entry not found");
    }
    
    this.timeEntries[index] = { ...this.timeEntries[index], ...timeEntryData };
    return { ...this.timeEntries[index] };
  }

  async delete(id) {
    await this.delay(300);
    
    const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time entry not found");
    }
    
    const deleted = this.timeEntries.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new TimeTrackingService();