import React, { useState } from 'react';
import { Send, History, User } from 'lucide-react';
import { dataStore } from '../data/store';
import './Dashboard.css';

const DiaryPage = ({ currentUser }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [target, setTarget] = useState('all'); // 'all' or studentId
    const [selectedStudent, setSelectedStudent] = useState('');

    const classId = currentUser?.classId || 'c1';
    const students = dataStore.getStudents(classId);
    const history = dataStore.getDiaries(classId);

    const handleSend = (e) => {
        e.preventDefault();
        if (!subject || !content) return;

        const entry = {
            classId,
            subject,
            content,
            target: target === 'all' ? 'all' : 'student',
            studentId: target === 'student' ? selectedStudent : null,
            studentName: target === 'student' ? students.find(s => s.id === selectedStudent)?.name : 'All Students'
        };

        dataStore.sendDiary(entry);

        // Reset form
        setSubject('');
        setContent('');
        setTarget('all');
        setSelectedStudent('');

        // Force refresh (in a real app, use context or query cache)
        window.location.reload();
    };

    return (
        <div className="page-wrapper">
            <div className="grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
                {/* Compose Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="dashboard-welcome">
                        <h2>Class Diary</h2>
                        <p>Send notes, homework, or announcements.</p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleSend}>
                            <div className="form-group">
                                <label className="form-label">To</label>
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="target"
                                            value="all"
                                            checked={target === 'all'}
                                            onChange={(e) => setTarget(e.target.value)}
                                            style={{ accentColor: 'var(--primary)' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Entire Class</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="target"
                                            value="student"
                                            checked={target === 'student'}
                                            onChange={(e) => setTarget(e.target.value)}
                                            style={{ accentColor: 'var(--primary)' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Specific Student</span>
                                    </label>
                                </div>

                                {target === 'student' && (
                                    <select
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Student...</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., Math Homework"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={6}
                                    className="form-input"
                                    placeholder="Write your message here..."
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary">
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="chart-header">
                        <h3 className="chart-title">
                            <History size={20} />
                            Recent History
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.length === 0 ? (
                            <p className="text-center text-muted py-8">No diaries sent yet.</p>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
                                    <div className="flex-between mb-2">
                                        <h4 className="font-medium">{item.subject}</h4>
                                        <span className="text-xs text-muted">
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.content}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', background: 'var(--bg-app)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                        <User size={12} />
                                        <span>To: {item.studentName}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiaryPage;
