import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, UserCheck, BarChart2, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { dataStore } from '../data/store';
import { motion } from 'framer-motion';
import './Dashboard.css';

const ParentPortal = ({ currentUser }) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (currentUser) {
            // Parent View: Get only linked students
            const myStudents = dataStore.getParentStudents(currentUser.id);
            setStudents(myStudents);
            if (myStudents.length === 1) {
                setSelectedStudentId(myStudents[0].id);
            }
        } else {
            // Teacher View: Get all students
            setStudents(dataStore.getStudents('c1'));
        }
    }, [currentUser]);

    const student = students.find(s => s.id === selectedStudentId);
    const attendanceHistory = selectedStudentId ? dataStore.getStudentAttendanceHistory(selectedStudentId) : [];
    const diaries = selectedStudentId ? dataStore.getDiaries('c1', selectedStudentId) : [];
    const performanceData = selectedStudentId ? dataStore.getStudentPerformance(selectedStudentId) : [];

    if (!selectedStudentId) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-center"
                style={{ minHeight: '80vh', flexDirection: 'column', gap: '1.5rem' }}
            >
                <div className="stat-icon-wrapper bg-indigo" style={{ width: '6rem', height: '6rem', borderRadius: '50%', fontSize: '2rem' }}>
                    <UserCheck size={48} />
                </div>
                <div className="text-center">
                    <h2>{currentUser ? 'Welcome Parent' : 'Parent Portal'}</h2>
                    <p>{currentUser ? 'Select your child to view their report.' : 'Select a student to view their comprehensive report.'}</p>
                </div>
                {students.length > 0 ? (
                    <div className="card" style={{ width: '100%', maxWidth: '28rem', borderTop: '4px solid var(--primary)' }}>
                        <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {currentUser ? 'Your Children' : 'Select Student'}
                        </label>
                        <select
                            className="form-select"
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            value={selectedStudentId}
                        >
                            <option value="">-- Choose Child --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} (Class: {s.classId === 'c1' ? '5A' : '5B'})</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="card text-center text-danger">
                        No students linked to your account. Please contact the school admin.
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="page-wrapper">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card flex-between mb-8"
                style={{ flexWrap: 'wrap', gap: '1rem' }}
            >
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <div className="stat-icon-wrapper bg-indigo" style={{ width: '4rem', height: '4rem', borderRadius: '50%', margin: 0 }}>
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h2>{student.name}</h2>
                        <p>Class 5A • Parent: {student.parentName}</p>
                    </div>
                </div>
                {students.length > 1 && (
                    <button
                        onClick={() => setSelectedStudentId('')}
                        className="btn btn-secondary text-sm"
                    >
                        Switch Child
                    </button>
                )}
            </motion.div>

            <div className="grid-layout mb-8">
                {/* Performance Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card chart-card"
                >
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <Activity className="text-purple" />
                            Academic Performance
                        </h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name={student.name}
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fill="#8b5cf6"
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Attendance Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card chart-card"
                >
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <BarChart2 className="text-emerald" />
                            Attendance Overview
                        </h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Present', value: attendanceHistory.filter(r => r.status === 'present').length, color: '#10B981' },
                                { name: 'Absent', value: attendanceHistory.filter(r => r.status === 'absent').length, color: '#EF4444' },
                                { name: 'Late', value: attendanceHistory.filter(r => r.status === 'late').length, color: '#F59E0B' },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                    {
                                        [
                                            { name: 'Present', value: attendanceHistory.filter(r => r.status === 'present').length, color: '#10B981' },
                                            { name: 'Absent', value: attendanceHistory.filter(r => r.status === 'absent').length, color: '#EF4444' },
                                            { name: 'Late', value: attendanceHistory.filter(r => r.status === 'late').length, color: '#F59E0B' },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid-layout">
                {/* Attendance List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <Calendar className="text-indigo" />
                            Recent Attendance
                        </h3>
                    </div>

                    <div className="card" style={{ maxHeight: '24rem', overflowY: 'auto' }}>
                        {attendanceHistory.length === 0 ? (
                            <p className="text-center py-8">No attendance records found.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {attendanceHistory.map((record, idx) => (
                                    <div key={idx} className="flex-between" style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                        <span className="font-medium">{new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                        <span className={`badge ${record.status === 'present' ? 'badge-success' :
                                            record.status === 'absent' ? 'badge-danger' :
                                                'badge-warning'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Diary List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <BookOpen className="text-pink" />
                            School Diary
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '24rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {diaries.length === 0 ? (
                            <div className="card text-center" style={{ padding: '3rem' }}>
                                No diary entries yet.
                            </div>
                        ) : (
                            diaries.map(diary => (
                                <div key={diary.id} className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                                    <div className="flex-between mb-4">
                                        <h4 className="font-bold">{diary.subject}</h4>
                                        <span className="badge badge-neutral">{new Date(diary.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-main)' }}>{diary.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ParentPortal;
