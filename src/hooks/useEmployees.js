import { useState, useEffect } from "react";
import employeeService from "@/services/api/employeeService";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchEmployees = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.search(query);
      setEmployees(data);
    } catch (err) {
      setError("Failed to search employees. Please try again.");
      console.error("Error searching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      setError("");
      const newEmployee = await employeeService.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError("Failed to create employee. Please try again.");
      console.error("Error creating employee:", err);
      throw err;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      setError("");
      const updatedEmployee = await employeeService.update(id, employeeData);
      setEmployees(prev => 
        prev.map(emp => emp.Id === parseInt(id) ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (err) {
      setError("Failed to update employee. Please try again.");
      console.error("Error updating employee:", err);
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setError("");
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.Id !== parseInt(id)));
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
      console.error("Error deleting employee:", err);
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
    searchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};