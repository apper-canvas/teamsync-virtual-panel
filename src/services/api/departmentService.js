import departmentsData from "@/services/mockData/departments.json";
import employeeService from "@/services/api/employeeService";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    
    // Update employee counts
    const employees = await employeeService.getAll();
    return this.departments.map(dept => ({
      ...dept,
      employeeCount: employees.filter(emp => emp.department === dept.name).length
    }));
  }

  async getById(id) {
    await this.delay();
    const department = this.departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    
    const employees = await employeeService.getAll();
    const employeeCount = employees.filter(emp => emp.department === department.name).length;
    
    return { ...department, employeeCount };
  }

  async create(departmentData) {
    await this.delay(400);
    
    const newDepartment = {
      ...departmentData,
      Id: Math.max(...this.departments.map(dept => dept.Id), 0) + 1,
      employeeCount: 0
    };
    
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await this.delay(400);
    
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    
    this.departments[index] = { ...this.departments[index], ...departmentData };
    
    const employees = await employeeService.getAll();
    const employeeCount = employees.filter(emp => emp.department === this.departments[index].name).length;
    
    return { ...this.departments[index], employeeCount };
  }

  async delete(id) {
    await this.delay(300);
    
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    
    const deleted = this.departments.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new DepartmentService();