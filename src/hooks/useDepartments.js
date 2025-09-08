import { useState, useEffect } from 'react';
import departmentService from '@/services/api/departmentService';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData) => {
    try {
      const newDepartment = await departmentService.create(departmentData);
      setDepartments(prev => [newDepartment, ...prev]);
      return newDepartment;
    } catch (err) {
      console.error('Error creating department:', err);
      throw err;
    }
  };

  const updateDepartment = async (id, departmentData) => {
    try {
      const updatedDepartment = await departmentService.update(id, departmentData);
      setDepartments(prev => 
        prev.map(dept => dept.Id === parseInt(id) ? updatedDepartment : dept)
      );
      return updatedDepartment;
    } catch (err) {
      console.error('Error updating department:', err);
      throw err;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await departmentService.delete(id);
      setDepartments(prev => prev.filter(dept => dept.Id !== parseInt(id)));
    } catch (err) {
      console.error('Error deleting department:', err);
      throw err;
    }
  };

  const getDepartmentById = async (id) => {
    try {
      const department = await departmentService.getById(id);
      return department;
    } catch (err) {
      console.error('Error getting department by id:', err);
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
    deleteDepartment,
    getDepartmentById
  };
};