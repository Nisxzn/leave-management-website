import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { managerAPI } from '../utils/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ManagerDashboard = ({ user, onLogout }) => {
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await managerAPI.getAllLeaves();
            setLeaves(response.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    const handleStatusUpdate = async (leaveId, status) => {
        try {
            await managerAPI.updateLeaveStatus({ id: leaveId, status });
            fetchLeaves();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('Leave Management Report', 14, 20);

        // Date
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Filter data based on current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyLeaves = leaves.filter(leave => {
            const leaveDate = new Date(leave.created_at);
            return leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear;
        });

        // Table
        const tableData = monthlyLeaves.map(leave => [
            leave.full_name,
            leave.leave_type,
            leave.start_date,
            leave.end_date,
            leave.status,
        ]);

        doc.autoTable({
            startY: 40,
            head: [['Employee', 'Type', 'Start Date', 'End Date', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [14, 165, 233] },
        });

        doc.save(`leave-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'rejected':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            default:
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
        }
    };

    const filteredLeaves = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

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
                            <h1 className="text-3xl font-bold text-white mb-1">Manager Dashboard</h1>
                            <p className="text-white/70">Welcome, {user.full_name}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={generatePDF} className="btn-primary">
                                Export PDF Report
                            </button>
                            <button onClick={onLogout} className="btn-secondary">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <p className="text-white/60 text-sm mb-1">Total Requests</p>
                        <p className="text-3xl font-bold text-white">{leaves.length}</p>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="glass-card p-6"
                    >
                        <p className="text-white/60 text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-300">
                            {leaves.filter(l => l.status === 'pending').length}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <p className="text-white/60 text-sm mb-1">Approved</p>
                        <p className="text-3xl font-bold text-green-300">
                            {leaves.filter(l => l.status === 'approved').length}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="glass-card p-6"
                    >
                        <p className="text-white/60 text-sm mb-1">Rejected</p>
                        <p className="text-3xl font-bold text-red-300">
                            {leaves.filter(l => l.status === 'rejected').length}
                        </p>
                    </motion.div>
                </div>

                {/* Filter */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/70'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white/70'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70'
                                }`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70'
                                }`}
                        >
                            Rejected
                        </button>
                    </div>
                </motion.div>

                {/* Leave Requests Table */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-semibold text-white mb-4">Leave Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left text-white/80 py-3 px-4">Employee</th>
                                    <th className="text-left text-white/80 py-3 px-4">Type</th>
                                    <th className="text-left text-white/80 py-3 px-4">Start Date</th>
                                    <th className="text-left text-white/80 py-3 px-4">End Date</th>
                                    <th className="text-left text-white/80 py-3 px-4">Reason</th>
                                    <th className="text-left text-white/80 py-3 px-4">Status</th>
                                    <th className="text-left text-white/80 py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-white/60 py-8">
                                            No leave requests found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeaves.map((leave) => (
                                        <motion.tr
                                            key={leave.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-white">{leave.full_name}</td>
                                            <td className="py-3 px-4 text-white capitalize">{leave.leave_type}</td>
                                            <td className="py-3 px-4 text-white">{leave.start_date}</td>
                                            <td className="py-3 px-4 text-white">{leave.end_date}</td>
                                            <td className="py-3 px-4 text-white/80">{leave.reason}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(leave.status)}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {leave.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(leave.id, 'approved')}
                                                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                                                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
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

export default ManagerDashboard;
