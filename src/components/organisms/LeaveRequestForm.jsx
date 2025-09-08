import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import leaveRequestService from "@/services/api/leaveRequestService";

const LeaveRequestForm = ({ onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    employee_name_c: "John Doe", // In real app, would come from auth context
    leave_type_c: "",
    start_date_c: "",
    end_date_c: "",
    reason_c: "",
    urgency_c: "normal"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    { value: "vacation", label: "Vacation Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "personal", label: "Personal Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
    { value: "emergency", label: "Emergency Leave" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

if (!formData.leave_type_c) {
      newErrors.leave_type_c = "Leave type is required";
    }

    if (!formData.start_date_c) {
      newErrors.start_date_c = "Start date is required";
    }

    if (!formData.end_date_c) {
      newErrors.end_date_c = "End date is required";
    }

    if (formData.start_date_c && formData.end_date_c) {
      const start = new Date(formData.start_date_c);
      const end = new Date(formData.end_date_c);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.start_date_c = "Start date cannot be in the past";
      }

      if (end < start) {
        newErrors.end_date_c = "End date must be after start date";
      }
    }

    if (!formData.reason_c.trim()) {
      newErrors.reason_c = "Reason is required";
    } else if (formData.reason_c.trim().length < 10) {
      newErrors.reason_c = "Reason must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDays = () => {
if (!formData.start_date_c || !formData.end_date_c) return 0;
    const start = new Date(formData.start_date_c);
    const end = new Date(formData.end_date_c);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
const requestData = {
        ...formData,
        total_days_c: calculateDays(),
        status_c: "pending",
        created_at_c: new Date().toISOString(),
        manager_id_c: 1 // In real app, would be determined by employee's department
      };

      await leaveRequestService.create(requestData);
      
      toast.success("Leave request submitted successfully!");
      
      if (onSubmit) {
        onSubmit(requestData);
      }

      // Reset form
setFormData({
        employee_name_c: "John Doe",
        leave_type_c: "",
        start_date_c: "",
        end_date_c: "",
        reason_c: "",
        urgency_c: "normal"
      });

    } catch (error) {
      console.error("Failed to submit leave request:", error);
      toast.error("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-card p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Submit Leave Request</h2>
            <p className="text-sm text-slate-500">Fill in the details for your leave request</p>
          </div>
        </div>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Name (Read-only) */}
        <FormField label="Employee Name" error={errors.employeeName}>
          <div className="input-field bg-slate-50 text-slate-600 cursor-not-allowed">
{formData.employee_name_c}
          </div>
        </FormField>

        {/* Leave Type */}
        <FormField label="Leave Type" error={errors.leaveType} required>
          <select
name="leave_type_c"
            value={formData.leave_type_c}
            onChange={handleChange}
            error={errors.leave_type_c}
            className="input-field"
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Start Date" error={errors.startDate} required>
            <input
              type="date"
name="start_date_c"
              value={formData.start_date_c}
              onChange={handleChange}
              error={errors.start_date_c}
              className="input-field"
              required
            />
          </FormField>

          <FormField label="End Date" error={errors.endDate} required>
            <input
              type="date"
name="end_date_c"
              value={formData.end_date_c}
              onChange={handleChange}
              error={errors.end_date_c}
              className="input-field"
              required
            />
          </FormField>
        </div>

        {/* Total Days Display */}
{formData.start_date_c && formData.end_date_c && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Total Days: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Urgency */}
        <FormField label="Urgency Level">
          <select
name="urgency_c"
            value={formData.urgency_c}
            onChange={handleChange}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </FormField>

        {/* Reason */}
        <FormField label="Reason for Leave" error={errors.reason} required>
          <textarea
name="reason_c"
            value={formData.reason_c}
            onChange={handleChange}
            error={errors.reason_c}
            placeholder="Please provide a detailed reason for your leave request..."
            className="input-field min-h-[120px] resize-vertical"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
Minimum 10 characters ({formData.reason_c.length}/10)
          </p>
        </FormField>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
          {onCancel && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LeaveRequestForm;