import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { employeeAPI } from '../utils/api';

const EmployeeDashboard = ({ user, onLogout }) => {
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        leave_type: 'sick',
        start_date: '',
        end_date: '',
        reason: '',
    });

    useEffect(() => {
        fetchLeaveHistory();
    }, []);

    const fetchLeaveHistory = async () => {
        try {
            const response = await employeeAPI.getLeaveHistory(user.id);
            setLeaveHistory(response.data);
        } catch (error) {
            console.error('Error fetching leave history:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await employeeAPI.applyLeave({ ...formData, user_id: user.id });
            setShowForm(false);
            setFormData({ leave_type: 'sick', start_date: '', end_date: '', reason: '' });
            fetchLeaveHistory();
        } catch (error) {
            console.error('Error applying leave:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'status-approved';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-pending';
        }
    };

    return (
        <div className="min-h-screen p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-1">Employee Dashboard</h1>
                            <p className="text-slate-600">Welcome, {user.full_name}</p>
                        </div>
                        <button onClick={onLogout} className="btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-6"
                >
                    <h2 className="text-2xl font-semibold text-slate-800 mb-4">Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-600 text-sm">Full Name</p>
                            <p className="text-slate-800 font-medium">{user.full_name}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Email</p>
                            <p className="text-slate-800 font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Username</p>
                            <p className="text-slate-800 font-medium">{user.username}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 text-sm">Role</p>
                            <p className="text-slate-800 font-medium capitalize">{user.role}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Apply Leave Button */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                    >
                        {showForm ? 'Cancel' : 'Apply for Leave'}
                    </button>
                </motion.div>

                {/* Leave Application Form */}
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="glass-card p-6 mb-6"
                    >
                        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Apply for Leave</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-700 font-medium mb-2">Leave Type</label>
                                <select
                                    value={formData.leave_type}
                                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                                    className="input-field w-full"
                                    required
                                >
                                    <option value="sick">Sick Leave</option>
                                    <option value="casual">Casual Leave</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="input-field w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="input-field w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-2">Reason</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="input-field w-full h-24 resize-none"
                                    placeholder="Enter reason for leave..."
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                Submit Application
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Leave History */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-semibold text-slate-800 mb-4">Leave History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="table-header-border">
                                    <th className="text-left text-slate-700 font-semibold py-3 px-4">Type</th>
                                    <th className="text-left text-slate-700 font-semibold py-3 px-4">Start Date</th>
                                    <th className="text-left text-slate-700 font-semibold py-3 px-4">End Date</th>
                                    <th className="text-left text-slate-700 font-semibold py-3 px-4">Reason</th>
                                    <th className="text-left text-slate-700 font-semibold py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-slate-500 py-8">
                                            No leave history found
                                        </td>
                                    </tr>
                                ) : (
                                    leaveHistory.map((leave) => (
                                        <motion.tr
                                            key={leave.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="table-row-border table-row-hover transition-colors"
                                        >
                                            <td className="py-3 px-4 text-slate-800 capitalize font-medium">{leave.leave_type}</td>
                                            <td className="py-3 px-4 text-slate-700">{leave.start_date}</td>
                                            <td className="py-3 px-4 text-slate-700">{leave.end_date}</td>
                                            <td className="py-3 px-4 text-slate-600">{leave.reason}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(leave.status)}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default EmployeeDashboard;

