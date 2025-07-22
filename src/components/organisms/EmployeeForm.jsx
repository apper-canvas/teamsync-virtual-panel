import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const EmployeeForm = ({ employee, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    hireDate: "",
    status: "active",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split("T")[0] : "",
        emergencyContact: employee.emergencyContact || {
          name: "",
          phone: "",
          relationship: ""
        }
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        hireDate: "",
        status: "active",
        emergencyContact: {
          name: "",
          phone: "",
          relationship: ""
        }
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.hireDate) newErrors.hireDate = "Hire date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="UserPlus" className="w-6 h-6" />
              <h2 className="text-xl font-bold">
                {employee ? "Edit Employee" : "Add New Employee"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <FormField
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <FormField
                label="Email"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <FormField
                label="Phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Role/Position"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                required
              />
              <FormField
                label="Department"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                required
              />
              <FormField
                label="Hire Date"
                id="hireDate"
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                error={errors.hireDate}
                required
              />
              <FormField
                label="Status"
                id="status"
              >
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </FormField>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Contact Name"
                id="emergencyContactName"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
              />
              <FormField
                label="Contact Phone"
                id="emergencyContactPhone"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
              />
              <FormField
                label="Relationship"
                id="emergencyContactRelationship"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
                placeholder="e.g., Spouse, Parent"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
            >
              {employee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployeeForm;