import { format } from "date-fns";

class TimeTrackingService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'time_entry_c';
    this.currentEntry = null;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching time entries:", error);
      throw error;
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching time entries by employee:", error);
      throw error;
    }
  }

  async getTodaysEntries() {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [today]}],
        orderBy: [{"fieldName": "clock_in_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's entries:", error);
      throw error;
    }
  }

  async getCurrentEntry() {
    // For this implementation, we'll store current entry in memory
    // In a full implementation, this might query for the latest uncompleted entry
    return this.currentEntry ? { ...this.currentEntry } : null;
  }

  async clockIn(employeeId = 1) {
    try {
      // Check if already clocked in
      if (this.currentEntry && !this.currentEntry.clock_out_c) {
        throw new Error("Already clocked in");
      }
      
      const now = new Date();
      const entry = {
        Name: `Clock In - ${format(now, "yyyy-MM-dd HH:mm")}`,
        employee_id_c: parseInt(employeeId),
        clock_in_c: now.toISOString(),
        clock_out_c: null,
        total_hours_c: 0,
        date_c: format(now, "yyyy-MM-dd"),
        Tags: ""
      };
      
      // Store as current entry (not yet saved to database)
      this.currentEntry = { ...entry };
      return { ...entry };
    } catch (error) {
      console.error("Error clocking in:", error);
      throw error;
    }
  }

  async clockOut() {
    try {
      if (!this.currentEntry || this.currentEntry.clock_out_c) {
        throw new Error("Not currently clocked in");
      }
      
      const now = new Date();
      const clockInTime = new Date(this.currentEntry.clock_in_c);
      const totalHours = (now - clockInTime) / (1000 * 60 * 60); // Convert to hours
      
      this.currentEntry.clock_out_c = now.toISOString();
      this.currentEntry.total_hours_c = parseFloat(totalHours.toFixed(2));
      
      // Now save to database
      const params = {
        records: [{ ...this.currentEntry }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const completedEntry = { ...this.currentEntry };
      this.currentEntry = null;
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return completedEntry;
    } catch (error) {
      console.error("Error clocking out:", error);
      throw error;
    }
  }

  async getWeeklyHours(employeeId, weekStart) {
    try {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [
                {"fieldName": "employee_id_c", "operator": "EqualTo", "values": [parseInt(employeeId)]},
                {"fieldName": "date_c", "operator": "GreaterThanOrEqualTo", "values": [format(weekStart, "yyyy-MM-dd")]},
                {"fieldName": "date_c", "operator": "LessThanOrEqualTo", "values": [format(weekEnd, "yyyy-MM-dd")]}
              ],
              operator: "AND"
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const entries = response.data || [];
      const totalHours = entries.reduce((sum, entry) => sum + (entry.total_hours_c || 0), 0);
      
      return {
        entries,
        totalHours: parseFloat(totalHours.toFixed(2)),
        weekStart: format(weekStart, "yyyy-MM-dd"),
        weekEnd: format(weekEnd, "yyyy-MM-dd")
      };
    } catch (error) {
      console.error("Error fetching weekly hours:", error);
      throw error;
    }
  }

  async create(timeEntryData) {
    try {
      const params = {
        records: [{
          Name: timeEntryData.Name || `Time Entry - ${format(new Date(), "yyyy-MM-dd HH:mm")}`,
          employee_id_c: parseInt(timeEntryData.employee_id_c || timeEntryData.employeeId),
          clock_in_c: timeEntryData.clock_in_c || timeEntryData.clockIn,
          clock_out_c: timeEntryData.clock_out_c || timeEntryData.clockOut || null,
          total_hours_c: parseFloat(timeEntryData.total_hours_c || timeEntryData.totalHours || 0),
          date_c: timeEntryData.date_c || timeEntryData.date || format(new Date(), "yyyy-MM-dd"),
          Tags: timeEntryData.Tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} time entries:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating time entry:", error);
      throw error;
    }
  }

  async update(id, timeEntryData) {
    try {
      const updateData = {};
      
      // Only include updateable fields
      if (timeEntryData.Name !== undefined) updateData.Name = timeEntryData.Name;
      if (timeEntryData.employee_id_c !== undefined || timeEntryData.employeeId !== undefined) {
        updateData.employee_id_c = parseInt(timeEntryData.employee_id_c || timeEntryData.employeeId);
      }
      if (timeEntryData.clock_in_c !== undefined || timeEntryData.clockIn !== undefined) {
        updateData.clock_in_c = timeEntryData.clock_in_c || timeEntryData.clockIn;
      }
      if (timeEntryData.clock_out_c !== undefined || timeEntryData.clockOut !== undefined) {
        updateData.clock_out_c = timeEntryData.clock_out_c || timeEntryData.clockOut;
      }
      if (timeEntryData.total_hours_c !== undefined || timeEntryData.totalHours !== undefined) {
        updateData.total_hours_c = parseFloat(timeEntryData.total_hours_c || timeEntryData.totalHours);
      }
      if (timeEntryData.date_c !== undefined || timeEntryData.date !== undefined) {
        updateData.date_c = timeEntryData.date_c || timeEntryData.date;
      }
      if (timeEntryData.Tags !== undefined) updateData.Tags = timeEntryData.Tags;

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} time entries:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating time entry:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} time entries:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting time entry:", error);
      throw error;
    }
  }
}

export default new TimeTrackingService();