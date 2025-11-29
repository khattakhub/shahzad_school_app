import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle, Clock } from 'lucide-react';
import { dataStore } from '../data/store';
import './Dashboard.css';

const AttendancePage = ({ currentUser }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [saved, setSaved] = useState(false);

    const classId = currentUser?.classId || 'c1';

    useEffect(() => {
        setStudents(dataStore.getStudents(classId));
    }, [classId]);

    useEffect(() => {
        // Load existing attendance for the date
        const existing = dataStore.getAttendance(date, classId);
        if (Object.keys(existing).length > 0) {
            setAttendance(existing);
        } else {
            // Default to all present if new day
            const initial = {};
            students.forEach(s => initial[s.id] = 'present');
            setAttendance(initial);
        }
        setSaved(false);
    }, [date, students, classId]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
        setSaved(false);
    };

    const handleSave = () => {
        dataStore.saveAttendance(date, classId, attendance);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const StatusButton = ({ status, current, onClick, icon: Icon, label, colorVar }) => {
        const isActive = current === status;
        return (
            <button
                onClick={onClick}
                className="btn"
                style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    gap: '0.5rem',
                    backgroundColor: isActive ? `var(${colorVar})` : 'white',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    border: isActive ? 'none' : '1px solid var(--border)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                }}
            >
                <Icon size={16} />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="page-wrapper">
            <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div className="dashboard-welcome">
                    <h2>Attendance</h2>
                    <p>Mark attendance for Class 5A</p>
                </div>
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-input"
                        style={{ width: 'auto' }}
                    />
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                    >
                        <Save size={18} />
                        {saved ? 'Saved!' : 'Save Attendance'}
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Student Name</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="hover:bg-gray-50">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div className="font-medium">{student.name}</div>
                                        <div className="text-xs text-muted">Parent: {student.parentName}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <StatusButton
                                                status="present"
                                                current={attendance[student.id]}
                                                onClick={() => handleStatusChange(student.id, 'present')}
                                                icon={CheckCircle}
                                                label="Present"
                                                colorVar="--secondary"
                                            />
                                            <StatusButton
                                                status="absent"
                                                current={attendance[student.id]}
                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                icon={XCircle}
                                                label="Absent"
                                                colorVar="--accent"
                                            />
                                            <StatusButton
                                                status="late"
                                                current={attendance[student.id]}
                                                onClick={() => handleStatusChange(student.id, 'late')}
                                                icon={Clock}
                                                label="Late"
                                                colorVar="--text-light" // Using text-light (slate 400) or maybe orange if defined
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
