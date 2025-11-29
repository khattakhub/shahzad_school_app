import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, BookOpen, Users, ArrowRight, TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { dataStore } from '../data/store';
import { motion } from 'framer-motion';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="card stat-card"
    >
        <div className={`stat-card-bg ${colorClass}`}></div>
        <div className={`stat-icon-wrapper ${colorClass}`}>
            <Icon size={28} />
        </div>
        <div className="stat-content">
            <p>{title}</p>
            <h3>{value}</h3>
        </div>
    </motion.div>
);

const ActionCard = ({ title, description, to, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        style={{ height: '100%' }}
    >
        <Link to={to} className="card action-card group">
            <div className={`action-card-bg ${colorClass}`}></div>
            <div className={`action-icon-wrapper ${colorClass}`}>
                <Icon size={24} />
            </div>
            <h3 className="action-title">{title}</h3>
            <p className="action-desc">{description}</p>
            <div className="action-link">
                Get Started <ArrowRight size={18} className="ml-2" />
            </div>
        </Link>
    </motion.div>
);

const TeacherDashboard = ({ currentUser }) => {
    // Default to 'c1' if not assigned (for demo robustness), but ideally should show empty state
    const classId = currentUser?.classId || 'c1';

    const students = dataStore.getStudents(classId);
    const today = new Date().toISOString().split('T')[0];
    const attendance = dataStore.getAttendance(today, classId);
    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    const isAttendanceMarked = Object.keys(attendance).length > 0;

    const weeklyStats = dataStore.getAttendanceStats(classId);
    const assignmentStats = dataStore.getClassAssignmentStats(classId);

    const statusCounts = [
        { name: 'Present', value: Object.values(attendance).filter(s => s === 'present').length, color: '#10B981' },
        { name: 'Absent', value: Object.values(attendance).filter(s => s === 'absent').length, color: '#EF4444' },
        { name: 'Late', value: Object.values(attendance).filter(s => s === 'late').length, color: '#F59E0B' },
    ].filter(item => item.value > 0);

    if (!isAttendanceMarked && statusCounts.length === 0) {
        statusCounts.push({ name: 'No Data', value: 1, color: '#E5E7EB' });
    }

    if (!currentUser?.classId) {
        return (
            <div className="page-wrapper">
                <div className="dashboard-header">
                    <h2>Welcome, {currentUser?.name || 'Teacher'}!</h2>
                    <p>You have not been assigned a class yet. Please contact the administrator.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="dashboard-header"
            >
                <div className="dashboard-welcome">
                    <h2>Welcome back, {currentUser.name}!</h2>
                    <p>Here's your daily overview for your class.</p>
                </div>
                <div className="dashboard-date hidden md:block">
                    <p className="dashboard-date-label">Today's Date</p>
                    <p className="dashboard-date-value">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
            </motion.div>

            <div className="grid-layout-3 mb-8">
                <StatCard title="Total Students" value={students.length} icon={Users} colorClass="bg-blue" delay={0.1} />
                <StatCard title="Present Today" value={isAttendanceMarked ? presentCount : '-'} icon={CalendarCheck} colorClass="bg-emerald" delay={0.2} />
                <StatCard title="Diaries Sent" value={dataStore.getDiaries(classId).length} icon={BookOpen} colorClass="bg-purple" delay={0.3} />
            </div>

            <div className="grid-layout mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card chart-card"
                >
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <TrendingUp className="text-indigo" size={24} />
                            Attendance Trends
                        </h3>
                        <select className="form-select" style={{ width: 'auto' }}>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyStats}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card chart-card"
                >
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <PieIcon className="text-emerald" size={24} />
                            Today's Status
                        </h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusCounts}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-center-label">
                            <div className="text-center">
                                <span className="pie-count">{isAttendanceMarked ? presentCount : '0'}</span>
                                <span className="pie-label">Present</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="card mb-8"
            >
                <div className="chart-header">
                    <h3 className="chart-title">
                        <BarChart2 className="text-orange" size={24} />
                        Weekly Assignments
                    </h3>
                </div>
                <div className="chart-container" style={{ height: '16rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assignmentStats}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Legend />
                            <Bar dataKey="submitted" name="Submitted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pending" name="Pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <div>
                <h3 className="mb-6">Quick Actions</h3>
                <div className="grid-layout">
                    <ActionCard
                        title="Mark Attendance"
                        description="Record daily attendance for your class. Mark present, absent, or late."
                        to="/attendance"
                        icon={CalendarCheck}
                        colorClass="bg-emerald"
                        delay={0.6}
                    />
                    <ActionCard
                        title="Send Diary"
                        description="Compose and send daily notes, homework, or announcements to parents."
                        to="/diary"
                        icon={BookOpen}
                        colorClass="bg-indigo"
                        delay={0.7}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
