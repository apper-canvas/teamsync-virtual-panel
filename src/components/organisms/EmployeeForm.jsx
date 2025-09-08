import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const EmployeeForm = ({ employee, onSubmit, onCancel, isOpen }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    role_c: "",
    department_c: "",
    hire_date_c: "",
    status_c: "active",
    emergency_contact_name_c: "",
    emergency_contact_phone_c: "",
    emergency_contact_relationship_c: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
if (employee) {
      setFormData({
        first_name_c: employee.first_name_c || "",
        last_name_c: employee.last_name_c || "",
        email_c: employee.email_c || "",
        phone_c: employee.phone_c || "",
        role_c: employee.role_c || "",
        department_c: employee.department_c || "",
        hire_date_c: employee.hire_date_c ? new Date(employee.hire_date_c).toISOString().split("T")[0] : "",
        status_c: employee.status_c || "active",
        emergency_contact_name_c: employee.emergency_contact_name_c || "",
        emergency_contact_phone_c: employee.emergency_contact_phone_c || "",
        emergency_contact_relationship_c: employee.emergency_contact_relationship_c || ""
      });
    } else {
setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        role_c: "",
        department_c: "",
        hire_date_c: "",
        status_c: "active",
        emergency_contact_name_c: "",
        emergency_contact_phone_c: "",
        emergency_contact_relationship_c: ""
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

if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email_c)) newErrors.email_c = "Invalid email format";
    if (!formData.phone_c.trim()) newErrors.phone_c = "Phone is required";
    if (!formData.role_c.trim()) newErrors.role_c = "Role is required";
    if (!formData.department_c.trim()) newErrors.department_c = "Department is required";
    if (!formData.hire_date_c) newErrors.hire_date_c = "Hire date is required";
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
name="first_name_c"
                value={formData.first_name_c}
                onChange={handleChange}
                error={errors.first_name_c}
                required
              />
              <FormField
                label="Last Name"
                id="lastName"
name="last_name_c"
                value={formData.last_name_c}
                onChange={handleChange}
error={errors.last_name_c}
                required
              />
              <FormField
                label="Email"
                id="email"
                type="email"
name="email_c"
                value={formData.email_c}
                onChange={handleChange}
                error={errors.email_c}
                required
              />
              <FormField
                label="Phone"
                id="phone"
name="phone_c"
                value={formData.phone_c}
                onChange={handleChange}
                error={errors.phone_c}
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
name="role_c"
                value={formData.role_c}
                onChange={handleChange}
                error={errors.role_c}
                required
              />
              <FormField
                label="Department"
                id="department"
name="department_c"
                value={formData.department_c}
                onChange={handleChange}
error={errors.department_c}
                required
              />
              <FormField
                label="Hire Date"
                id="hireDate"
                type="date"
name="hire_date_c"
                value={formData.hire_date_c}
                onChange={handleChange}
                error={errors.hire_date_c}
                required
              />
              <FormField
                label="Status"
                id="status"
              >
                <select
                  id="status"
name="status_c"
                  value={formData.status_c}
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
name="emergency_contact_name_c"
                value={formData.emergency_contact_name_c}
                onChange={handleChange}
              />
              <FormField
                label="Contact Phone"
                id="emergencyContactPhone"
name="emergency_contact_phone_c"
                value={formData.emergency_contact_phone_c}
                onChange={handleChange}
              />
              <FormField
                label="Relationship"
                id="emergencyContactRelationship"
name="emergency_contact_relationship_c"
                value={formData.emergency_contact_relationship_c}
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