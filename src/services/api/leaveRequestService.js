class LeaveRequestService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'leave_request_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "leave_type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "total_days_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "urgency_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "manager_id_c"}},
          {"field": {"Name": "reviewed_at_c"}},
          {"field": {"Name": "reviewed_by_c"}},
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
      console.error("Error fetching leave requests:", error);
      throw error;
    }
  }

  async getById(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID: must be a positive integer');
    }

    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "leave_type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "total_days_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "urgency_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "manager_id_c"}},
          {"field": {"Name": "reviewed_at_c"}},
          {"field": {"Name": "reviewed_by_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave request ${id}:`, error);
      throw error;
    }
  }

  async create(requestData) {
    try {
      const params = {
        records: [{
          Name: requestData.Name || `Leave Request - ${requestData.employee_name_c}`,
          employee_name_c: requestData.employee_name_c || requestData.employeeName,
          leave_type_c: requestData.leave_type_c || requestData.leaveType,
          start_date_c: requestData.start_date_c || requestData.startDate,
          end_date_c: requestData.end_date_c || requestData.endDate,
          total_days_c: parseInt(requestData.total_days_c || requestData.totalDays || 0),
          reason_c: requestData.reason_c || requestData.reason,
          urgency_c: requestData.urgency_c || requestData.urgency || "normal",
          status_c: requestData.status_c || requestData.status || "pending",
          created_at_c: requestData.created_at_c || requestData.createdAt || new Date().toISOString(),
          manager_id_c: parseInt(requestData.manager_id_c || requestData.managerId || 1),
          reviewed_at_c: requestData.reviewed_at_c || requestData.reviewedAt || null,
          reviewed_by_c: requestData.reviewed_by_c || requestData.reviewedBy || "",
          Tags: requestData.Tags || ""
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
          console.error(`Failed to create ${failed.length} leave requests:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating leave request:", error);
      throw error;
    }
  }

  async update(id, data) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID: must be a positive integer');
    }

    try {
      const updateData = {};
      
      // Only include updateable fields
      if (data.Name !== undefined) updateData.Name = data.Name;
      if (data.employee_name_c !== undefined || data.employeeName !== undefined) {
        updateData.employee_name_c = data.employee_name_c || data.employeeName;
      }
      if (data.leave_type_c !== undefined || data.leaveType !== undefined) {
        updateData.leave_type_c = data.leave_type_c || data.leaveType;
      }
      if (data.start_date_c !== undefined || data.startDate !== undefined) {
        updateData.start_date_c = data.start_date_c || data.startDate;
      }
      if (data.end_date_c !== undefined || data.endDate !== undefined) {
        updateData.end_date_c = data.end_date_c || data.endDate;
      }
      if (data.total_days_c !== undefined || data.totalDays !== undefined) {
        updateData.total_days_c = parseInt(data.total_days_c || data.totalDays);
      }
      if (data.reason_c !== undefined || data.reason !== undefined) {
        updateData.reason_c = data.reason_c || data.reason;
      }
      if (data.urgency_c !== undefined || data.urgency !== undefined) {
        updateData.urgency_c = data.urgency_c || data.urgency;
      }
      if (data.status_c !== undefined || data.status !== undefined) {
        updateData.status_c = data.status_c || data.status;
      }
      if (data.created_at_c !== undefined || data.createdAt !== undefined) {
        updateData.created_at_c = data.created_at_c || data.createdAt;
      }
      if (data.manager_id_c !== undefined || data.managerId !== undefined) {
        updateData.manager_id_c = parseInt(data.manager_id_c || data.managerId);
      }
      if (data.reviewed_at_c !== undefined || data.reviewedAt !== undefined) {
        updateData.reviewed_at_c = data.reviewed_at_c || data.reviewedAt;
      }
      if (data.reviewed_by_c !== undefined || data.reviewedBy !== undefined) {
        updateData.reviewed_by_c = data.reviewed_by_c || data.reviewedBy;
      }
      if (data.Tags !== undefined) updateData.Tags = data.Tags;

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
          console.error(`Failed to update ${failed.length} leave requests:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating leave request:", error);
      throw error;
    }
  }

  async delete(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID: must be a positive integer');
    }

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
          console.error(`Failed to delete ${failed.length} leave requests:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting leave request:", error);
      throw error;
    }
  }
}

export default new LeaveRequestService();