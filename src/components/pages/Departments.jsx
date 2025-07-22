import { useState } from "react";
import { motion } from "framer-motion";
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const DepartmentCard = ({ department, employees, onEdit, onDelete }) => {
  const departmentEmployees = employees.filter(emp => emp.department === department.name);
  const activeEmployees = departmentEmployees.filter(emp => emp.status === "active");
  
  const manager = employees.find(emp => emp.Id === department.managerId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card-premium p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{department.name}</h3>
            <p className="text-slate-600 text-sm">{department.description}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(department)}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(department)}
            className="text-red-600 hover:text-red-700"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold gradient-text">{departmentEmployees.length}</div>
          <div className="text-sm text-slate-600">Total Members</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{activeEmployees.length}</div>
          <div className="text-sm text-slate-600">Active</div>
        </div>
      </div>

      {/* Manager */}
      {manager && (
        <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800">
                {manager.firstName} {manager.lastName}
              </div>
              <div className="text-xs text-slate-500">Department Manager</div>
            </div>
          </div>
        </div>
      )}

      {/* Employee List Preview */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Team Members</h4>
        {departmentEmployees.length > 0 ? (
          <div className="space-y-2">
            {departmentEmployees.slice(0, 3).map((employee) => (
              <div key={employee.Id} className="flex items-center space-x-3 text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">
                    {employee.firstName.charAt(0)}
                  </span>
                </div>
                <span className="text-slate-700">{employee.firstName} {employee.lastName}</span>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  employee.status === "active" 
                    ? "bg-green-100 text-green-700"
                    : employee.status === "on-leave"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {employee.status === "on-leave" ? "On Leave" : employee.status}
                </div>
              </div>
            ))}
            {departmentEmployees.length > 3 && (
              <div className="text-xs text-slate-500 pl-9">
                +{departmentEmployees.length - 3} more members
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500">
            <ApperIcon name="Users" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No team members yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DepartmentForm = ({ department, onSubmit, onCancel, isOpen, employees }) => {
  const [formData, setFormData] = useState({
    name: "",
    managerId: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  useState(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        managerId: department.managerId || "",
        description: department.description || ""
      });
    } else {
      setFormData({
        name: "",
        managerId: "",
        description: ""
      });
    }
    setErrors({});
  }, [department, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "managerId" ? parseInt(value) || "" : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Building2" className="w-6 h-6" />
              <h2 className="text-xl font-bold">
                {department ? "Edit Department" : "Add Department"}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Human Resources"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Manager
            </label>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Manager (Optional)</option>
              {employees.map(employee => (
                <option key={employee.Id} value={employee.Id}>
                  {employee.firstName} {employee.lastName} - {employee.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Brief description of the department..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {department ? "Update Department" : "Create Department"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Departments = () => {
  const { departments, loading: deptLoading, error: deptError, createDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const { employees, loading: empLoading } = useEmployees();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const loading = deptLoading || empLoading;

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = async (department) => {
    const departmentEmployees = employees.filter(emp => emp.department === department.name);
    
    if (departmentEmployees.length > 0) {
      toast.error("Cannot delete department with active employees. Please reassign employees first.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${department.name} department?`)) {
      try {
        await deleteDepartment(department.Id);
        toast.success("Department deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete department");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.Id, formData);
        toast.success("Department updated successfully!");
      } else {
        await createDepartment(formData);
        toast.success("Department created successfully!");
      }
      
      setIsFormOpen(false);
      setEditingDepartment(null);
    } catch (err) {
      toast.error("Failed to save department");
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (deptError) {
    return (
      <Error 
        message={deptError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Departments</h1>
          <p className="text-slate-600 mt-1">
            Organize your teams and manage department structure
          </p>
        </div>
        <Button onClick={handleAddDepartment} icon="Plus">
          Add Department
        </Button>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Building2" className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{departments.length}</div>
          <div className="text-slate-600">Total Departments</div>
        </div>
        
        <div className="card-premium p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Users" className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{employees.length}</div>
          <div className="text-slate-600">Total Employees</div>
        </div>
        
        <div className="card-premium p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
          </div>
          <div className="text-slate-600">Avg per Department</div>
        </div>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <Empty
          title="No departments found"
          description="Get started by creating your first department to organize your team."
          icon="Building2"
          action={handleAddDepartment}
          actionLabel="Add Department"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <DepartmentCard
              key={department.Id}
              department={department}
              employees={employees}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />
          ))}
        </div>
      )}

      {/* Department Form Modal */}
      <DepartmentForm
        department={editingDepartment}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
        employees={employees}
      />
    </motion.div>
  );
};

export default Departments;