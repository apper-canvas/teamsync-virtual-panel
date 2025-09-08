import employeeService from "@/services/api/employeeService";

class DepartmentService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'department_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "manager_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const departments = response.data || [];
      
      // Update employee counts
      try {
        const employees = await employeeService.getAll();
        return departments.map(dept => ({
          ...dept,
          employeeCount: employees.filter(emp => emp.department_c === dept.Name).length
        }));
      } catch (error) {
        // If employee service fails, return departments without counts
        console.error("Failed to load employee counts:", error);
        return departments;
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "manager_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const department = response.data;
      if (!department) {
        throw new Error("Department not found");
      }
      
      // Add employee count
      try {
        const employees = await employeeService.getAll();
        const employeeCount = employees.filter(emp => emp.department_c === department.Name).length;
        return { ...department, employeeCount };
      } catch (error) {
        console.error("Failed to load employee count:", error);
        return { ...department, employeeCount: 0 };
      }
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error);
      throw error;
    }
  }

  async create(departmentData) {
    try {
      const params = {
        records: [{
          Name: departmentData.name || departmentData.Name,
          manager_id_c: departmentData.manager_id_c ? parseInt(departmentData.manager_id_c) : null,
          description_c: departmentData.description_c || departmentData.description,
          employee_count_c: 0,
          Tags: departmentData.Tags || ""
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
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const newDepartment = successful.length > 0 ? successful[0].data : null;
        return newDepartment ? { ...newDepartment, employeeCount: 0 } : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      const updateData = {};
      
      // Only include updateable fields
      if (departmentData.Name !== undefined || departmentData.name !== undefined) {
        updateData.Name = departmentData.Name || departmentData.name;
      }
      if (departmentData.manager_id_c !== undefined) {
        updateData.manager_id_c = departmentData.manager_id_c ? parseInt(departmentData.manager_id_c) : null;
      }
      if (departmentData.description_c !== undefined || departmentData.description !== undefined) {
        updateData.description_c = departmentData.description_c || departmentData.description;
      }
      if (departmentData.employee_count_c !== undefined) {
        updateData.employee_count_c = parseInt(departmentData.employee_count_c);
      }
      if (departmentData.Tags !== undefined) updateData.Tags = departmentData.Tags;

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
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const updatedDepartment = successful.length > 0 ? successful[0].data : null;
        if (updatedDepartment) {
          // Add employee count
          try {
            const employees = await employeeService.getAll();
            const employeeCount = employees.filter(emp => emp.department_c === updatedDepartment.Name).length;
            return { ...updatedDepartment, employeeCount };
          } catch (error) {
            console.error("Failed to load employee count:", error);
            return { ...updatedDepartment, employeeCount: 0 };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating department:", error);
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
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting department:", error);
      throw error;
    }
  }
}

export default new DepartmentService();