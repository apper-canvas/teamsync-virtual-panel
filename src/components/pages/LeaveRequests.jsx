import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import LeaveRequestForm from "@/components/organisms/LeaveRequestForm";
import leaveRequestService from "@/services/api/leaveRequestService";
import { format } from "date-fns";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [userRole] = useState("manager"); // In real app, would come from auth context

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveRequestService.getAll();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load leave requests");
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId, action) => {
    try {
      const request = requests.find(r => r.Id === requestId);
      if (!request) return;

      const updatedRequest = {
        ...request,
status_c: action,
        reviewed_at_c: new Date().toISOString(),
        reviewed_by_c: "HR Manager" // In real app, would come from auth context
      };

      await leaveRequestService.update(requestId, updatedRequest);
      
      setRequests(prev => 
        prev.map(req => 
          req.Id === requestId ? updatedRequest : req
        )
      );

      const actionText = action === 'approved' ? 'approved' : 'denied';
      toast.success(`Leave request ${actionText} successfully`);

    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'denied': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-slate-600 bg-slate-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus === "all") return true;
return request.status_c === filterStatus;
  });

  const stats = {
total: requests.length,
    pending: requests.filter(r => r.status_c === 'pending').length,
    approved: requests.filter(r => r.status_c === 'approved').length,
    denied: requests.filter(r => r.status_c === 'denied').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-2 text-slate-600">Loading leave requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Requests</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={loadRequests} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leave Requests</h1>
          <p className="text-slate-600">Manage employee leave requests and approvals</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(true)}
          icon="Plus"
        >
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Requests</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Denied</p>
              <p className="text-2xl font-bold text-red-600">{stats.denied}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          {['all', 'pending', 'approved', 'denied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 text-xs">
                  ({status === 'pending' ? stats.pending : status === 'approved' ? stats.approved : stats.denied})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="card p-8 text-center">
            <ApperIcon name="Calendar" className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Leave Requests</h3>
            <p className="text-slate-500">
              {filterStatus === 'all' ? 'No leave requests found' : `No ${filterStatus} requests found`}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <motion.div
              key={request.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-5 h-5 text-white" />
                      </div>
                      <div>
<h3 className="font-semibold text-slate-800">{request.employee_name_c}</h3>
                        <p className="text-sm text-slate-500">{request.leave_type_c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Leave</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
<StatusBadge variant={getStatusVariant(request.status_c)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </StatusBadge>
<span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(request.urgency_c)}`}>
                        {request.urgency.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
{format(new Date(request.start_date_c), 'MMM dd')} - {format(new Date(request.end_date_c), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
<span>{request.total_days_c} day{request.total_days_c !== 1 ? 's' : ''}</span>
                      <span className="text-slate-600">{request.totalDays} days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="FileText" className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Submitted {format(new Date(request.createdAt), 'MMM dd')}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Reason: </span>
{request.reason_c}
                    </p>
                  </div>
                </div>

                {/* Manager Actions */}
{userRole === 'manager' && request.status_c === 'pending' && (
                  <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproval(request.Id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleApproval(request.Id, 'denied')}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="X" className="w-4 h-4 mr-1" />
                      Deny
                    </Button>
                  </div>
                )}

                {/* Status Info for Reviewed Requests */}
{request.status_c !== 'pending' && request.reviewed_at_c && (
                  <div className="text-xs text-slate-500 lg:text-right">
                    <p>{request.status_c.charAt(0).toUpperCase() + request.status_c.slice(1)} by {request.reviewed_by_c}</p>
                    <p>{format(new Date(request.reviewed_at_c), 'MMM dd, yyyy')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Leave Request Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <LeaveRequestForm
              onSubmit={() => {
                setShowForm(false);
                loadRequests();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;