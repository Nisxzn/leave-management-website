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
            <header className="glass-card mx-6 mt-6 p-4">
                <h1 className="text-2xl font-bold text-white text-center">ABC Company</h1>
                <p className="text-white/70 text-center">Manage your leaves easily and stay organized!</p>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-4xl font-bold text-white mb-2"
                        >
                            Leave Management
                        </motion.h1>
                        <p className="text-white/70">Sign in to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/80 mb-2 font-medium">Username</label>
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
                            <label className="block text-white/80 mb-2 font-medium">Password</label>
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
                                className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="glass-card mx-6 mb-6 p-4">
                <div className="text-center text-white/70 text-sm">
                    <p>© 2025 ABC Company Pvt Ltd. All rights reserved.</p>
                    <p className="mt-1">Designed by <span className="text-white font-semibold">Nithish</span></p>
                </div>
            </footer>
        </div>
    );
};

export default Login;
