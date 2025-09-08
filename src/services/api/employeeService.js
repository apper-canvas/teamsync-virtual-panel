class EmployeeService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'employee_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
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
      console.error("Error fetching employees:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
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
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  }

  async create(employeeData) {
    try {
      const params = {
        records: [{
          Name: employeeData.Name || `${employeeData.first_name_c} ${employeeData.last_name_c}`,
          first_name_c: employeeData.first_name_c,
          last_name_c: employeeData.last_name_c,
          email_c: employeeData.email_c,
          phone_c: employeeData.phone_c,
          role_c: employeeData.role_c,
          department_c: employeeData.department_c,
          hire_date_c: employeeData.hire_date_c,
          status_c: employeeData.status_c || "active",
          photo_url_c: employeeData.photo_url_c || "",
          emergency_contact_name_c: employeeData.emergency_contact_name_c || "",
          emergency_contact_phone_c: employeeData.emergency_contact_phone_c || "",
          emergency_contact_relationship_c: employeeData.emergency_contact_relationship_c || "",
          Tags: employeeData.Tags || ""
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
          console.error(`Failed to create ${failed.length} employees:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async update(id, employeeData) {
    try {
      const updateData = {};
      
      // Only include updateable fields
      if (employeeData.Name !== undefined) updateData.Name = employeeData.Name;
      if (employeeData.first_name_c !== undefined) updateData.first_name_c = employeeData.first_name_c;
      if (employeeData.last_name_c !== undefined) updateData.last_name_c = employeeData.last_name_c;
      if (employeeData.email_c !== undefined) updateData.email_c = employeeData.email_c;
      if (employeeData.phone_c !== undefined) updateData.phone_c = employeeData.phone_c;
      if (employeeData.role_c !== undefined) updateData.role_c = employeeData.role_c;
      if (employeeData.department_c !== undefined) updateData.department_c = employeeData.department_c;
      if (employeeData.hire_date_c !== undefined) updateData.hire_date_c = employeeData.hire_date_c;
      if (employeeData.status_c !== undefined) updateData.status_c = employeeData.status_c;
      if (employeeData.photo_url_c !== undefined) updateData.photo_url_c = employeeData.photo_url_c;
      if (employeeData.emergency_contact_name_c !== undefined) updateData.emergency_contact_name_c = employeeData.emergency_contact_name_c;
      if (employeeData.emergency_contact_phone_c !== undefined) updateData.emergency_contact_phone_c = employeeData.emergency_contact_phone_c;
      if (employeeData.emergency_contact_relationship_c !== undefined) updateData.emergency_contact_relationship_c = employeeData.emergency_contact_relationship_c;
      if (employeeData.Tags !== undefined) updateData.Tags = employeeData.Tags;

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
          console.error(`Failed to update ${failed.length} employees:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating employee:", error);
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
          console.error(`Failed to delete ${failed.length} employees:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  }

  async search(query) {
    try {
      if (!query) return await this.getAll();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "email_c", "operator": "Contains", "values": [query]},
                {"fieldName": "role_c", "operator": "Contains", "values": [query]},
                {"fieldName": "department_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching employees:", error);
      throw error;
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by status:", error);
      throw error;
    }
  }
}
export default new EmployeeService();