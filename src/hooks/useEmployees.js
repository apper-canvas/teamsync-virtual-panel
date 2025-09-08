import { useState, useEffect } from 'react';
import employeeService from '@/services/api/employeeService';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeeService.create(employeeData);
      setEmployees(prev => [newEmployee, ...prev]);
      return newEmployee;
    } catch (err) {
      console.error('Error creating employee:', err);
      throw err;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmployee = await employeeService.update(id, employeeData);
      setEmployees(prev => 
        prev.map(emp => emp.Id === parseInt(id) ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.Id !== parseInt(id)));
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  const searchEmployees = async (query) => {
    try {
      const results = await employeeService.search(query);
      return results;
    } catch (err) {
      console.error('Error searching employees:', err);
      throw err;
    }
  };

  const getByDepartment = async (department) => {
    try {
      const results = await employeeService.getByDepartment(department);
      return results;
    } catch (err) {
      console.error('Error getting employees by department:', err);
      throw err;
    }
  };

  const getByStatus = async (status) => {
    try {
      const results = await employeeService.getByStatus(status);
      return results;
    } catch (err) {
      console.error('Error getting employees by status:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    getByDepartment,
    getByStatus
  };
};