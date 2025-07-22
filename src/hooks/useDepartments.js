import { useState, useEffect } from "react";
import departmentService from "@/services/api/departmentService";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError("Failed to load departments. Please try again.");
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData) => {
    try {
      setError("");
      const newDepartment = await departmentService.create(departmentData);
      setDepartments(prev => [...prev, newDepartment]);
      return newDepartment;
    } catch (err) {
      setError("Failed to create department. Please try again.");
      console.error("Error creating department:", err);
      throw err;
    }
  };

  const updateDepartment = async (id, departmentData) => {
    try {
      setError("");
      const updatedDepartment = await departmentService.update(id, departmentData);
      setDepartments(prev => 
        prev.map(dept => dept.Id === parseInt(id) ? updatedDepartment : dept)
      );
      return updatedDepartment;
    } catch (err) {
      setError("Failed to update department. Please try again.");
      console.error("Error updating department:", err);
      throw err;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      setError("");
      await departmentService.delete(id);
      setDepartments(prev => prev.filter(dept => dept.Id !== parseInt(id)));
    } catch (err) {
      setError("Failed to delete department. Please try again.");
      console.error("Error deleting department:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};