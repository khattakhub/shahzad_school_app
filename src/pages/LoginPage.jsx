import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Lock, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { dataStore } from '../data/store';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [role, setRole] = useState('teacher'); // 'teacher', 'parent', 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (role === 'admin') {
            // Simple admin check (demo)
            if (email === 'admin@school.com') {
                onLogin(role);
                navigate('/setup');
            } else {
                setError('Invalid admin credentials');
            }
        } else if (role === 'parent') {
            const parent = dataStore.validateParent(email, password);
            if (parent) {
                onLogin(role, parent); // Pass parent object
                navigate('/parent');
            } else {
                setError('Invalid Parent ID or Password');
            }
        } else {
            // Teacher
            const teacher = dataStore.validateTeacher(email, password);
            if (teacher) {
                onLogin(role, teacher);
                navigate('/');
            } else {
                setError('Invalid Teacher ID or Password');
            }
        }
    };

    // Reset fields when role changes
    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setError('');
        setPassword('');
        if (newRole === 'admin') setEmail('admin@school.com');
        else setEmail(''); // Clear for parent and teacher
    };

    return (
        <div className="login-page">
            <div className="login-bg-blob blob-1"></div>
            <div className="login-bg-blob blob-2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card glass login-card"
            >
                <div className="text-center mb-8">
                    <div className="login-icon-wrapper">
                        <BookOpen className="text-white" size={32} color="white" />
                    </div>
                    <h1 className="mb-4" style={{ fontSize: '2rem' }}>Welcome Back</h1>
                    <p>Sign in to SchoolApp</p>
                </div>

                <div className="role-selector">
                    <button
                        className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                        onClick={() => handleRoleChange('teacher')}
                    >
                        Teacher
                    </button>
                    <button
                        className={`role-btn ${role === 'parent' ? 'active' : ''}`}
                        onClick={() => handleRoleChange('parent')}
                    >
                        Parent
                    </button>
                    <button
                        className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => handleRoleChange('admin')}
                    >
                        Admin
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">
                            {role === 'admin' ? 'Email Address' : 'ID / Email'}
                        </label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type={role === 'parent' ? "text" : "email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input login-input"
                                placeholder={role === 'admin' ? "name@example.com" : "Enter your ID or Email"}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input login-input"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-danger text-sm text-center mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                    >
                        {role === 'admin' ? 'Setup School' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center text-sm text-muted mt-8" style={{ color: 'var(--text-light)' }}>
                    {role === 'admin' ? 'Demo Admin: admin@school.com' : 'Please enter your credentials'}
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
