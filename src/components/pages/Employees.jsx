import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import EmployeeForm from "@/components/organisms/EmployeeForm";
import EmployeeCard from "@/components/organisms/EmployeeCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: "all", label: "All Employees", icon: "Users" },
    { key: "active", label: "Active", icon: "UserCheck" },
    { key: "on-leave", label: "On Leave", icon: "UserMinus" },
    { key: "inactive", label: "Inactive", icon: "UserX" }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.key
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-50 hover:text-primary-600 shadow-sm"
          }`}
        >
          <ApperIcon name={filter.icon} className="w-4 h-4" />
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex bg-white rounded-lg p-1 shadow-sm">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-primary-500 text-white"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <ApperIcon name="Grid3x3" className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-primary-500 text-white"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <ApperIcon name="List" className="w-4 h-4" />
      </button>
    </div>
  );
};

const EmployeeList = ({ employees, onEdit, onView, onDelete }) => {
  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <motion.div
          key={employee.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-primary-600 font-medium">{employee.role}</p>
                <p className="text-slate-500 text-sm">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">{employee.email}</p>
                <p className="text-sm text-slate-500">{employee.phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(employee)}
                >
                  <ApperIcon name="Eye" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(employee)}
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(employee)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Employees = () => {
  const {
    employees,
    loading,
    error,
    searchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loadEmployees
  } = useEmployees();

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
// Filter employees based on active filter
  useEffect(() => {
    let filtered = employees;
    
    if (activeFilter !== "all") {
      filtered = employees.filter(emp => emp.status === activeFilter);
    }
    
    setFilteredEmployees(filtered);
  }, [employees, activeFilter]);
  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const results = await searchEmployees(query);
      let filtered = results;
      
      if (activeFilter !== "all") {
        filtered = results.filter(emp => emp.status === activeFilter);
      }
      
      setFilteredEmployees(filtered);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    let filtered = employees;
    
    if (filter !== "all") {
      filtered = employees.filter(emp => emp.status === filter);
    }
    
    // Apply search query if exists
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.role.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleViewEmployee = (employee) => {
    // In a real app, this would navigate to employee detail page
    toast.info(`Viewing ${employee.firstName} ${employee.lastName}`);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await deleteEmployee(employee.Id);
        toast.success("Employee deleted successfully!");
        
        // Update filtered employees
        setFilteredEmployees(prev => prev.filter(emp => emp.Id !== employee.Id));
      } catch (err) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.Id, formData);
        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(formData);
        toast.success("Employee added successfully!");
      }
      
      setIsFormOpen(false);
      setEditingEmployee(null);
      
      // Reload to get fresh data
      await loadEmployees();
    } catch (err) {
      toast.error("Failed to save employee");
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadEmployees}
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
          <h1 className="text-3xl font-bold gradient-text">Employees</h1>
          <p className="text-slate-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        <Button onClick={handleAddEmployee} icon="Plus">
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search employees by name, email, role, or department..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          </div>
        </div>
        
        <div className="mt-4">
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Employee Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
        {searchQuery && (
          <p className="text-sm text-slate-500">
            Search results for "{searchQuery}"
          </p>
        )}
      </div>

      {/* Employee Display */}
      {filteredEmployees.length === 0 ? (
        <Empty
          title="No employees found"
          description={
            activeFilter === "all" 
              ? "Get started by adding your first team member."
              : `No employees with status "${activeFilter}" found.`
          }
          icon="Users"
          action={activeFilter === "all" ? handleAddEmployee : undefined}
          actionLabel="Add Employee"
        />
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.Id}
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onView={handleViewEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </div>
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onView={handleViewEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
        </>
      )}

      {/* Employee Form Modal */}
      <EmployeeForm
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
      />
    </motion.div>
  );
};

export default Employees;