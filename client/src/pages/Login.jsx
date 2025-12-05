import { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login({ username, password });
            if (response.data.status === 'success') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onLoginSuccess(response.data.user);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="glass-card mx-6 mt-6 p-5">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-black font-bold text-xl">A</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ABC Company</h1>
                        <p className="text-slate-600 text-sm">Leave Management System</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-10 w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl font-bold text-slate-800 mb-2 tracking-tight"
                        >
                            Welcome Back
                        </motion.h1>
                        <p className="text-slate-600 text-sm">Please sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-700 mb-2 font-medium text-sm">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field w-full"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-700 mb-2 font-medium text-sm">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field w-full"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-6"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <p className="text-center text-slate-500 text-xs">
                            For assistance, contact your system administrator
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="glass-card mx-6 mb-6 p-4">
                <div className="text-center text-slate-600 text-xs">
                    <p>© 2025 ABC Company Pvt Ltd. All rights reserved.</p>
                    <p className="mt-1">Designed by <span className="text-slate-700 font-medium">Nithish</span></p>
                </div>
            </footer>
        </div>
    );
};

export default Login;

