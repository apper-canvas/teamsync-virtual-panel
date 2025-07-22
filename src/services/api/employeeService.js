import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.employees];
  }

  async getById(id) {
    await this.delay();
    const employee = this.employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  }

  async create(employeeData) {
    await this.delay(400);
    
    const newEmployee = {
      ...employeeData,
      Id: Math.max(...this.employees.map(emp => emp.Id), 0) + 1,
      hireDate: employeeData.hireDate || new Date().toISOString().split("T")[0]
    };
    
    this.employees.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, employeeData) {
    await this.delay(400);
    
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    
    this.employees[index] = { ...this.employees[index], ...employeeData };
    return { ...this.employees[index] };
  }

  async delete(id) {
    await this.delay(300);
    
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    
    const deleted = this.employees.splice(index, 1)[0];
    return { ...deleted };
  }

  async search(query) {
    await this.delay(200);
    
    if (!query) return [...this.employees];
    
    const searchTerm = query.toLowerCase();
    return this.employees.filter(emp => 
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.role.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm)
    );
  }

  async getByDepartment(department) {
    await this.delay(200);
    return this.employees.filter(emp => emp.department === department);
  }

  async getByStatus(status) {
    await this.delay(200);
    return this.employees.filter(emp => emp.status === status);
  }
}

export default new EmployeeService();