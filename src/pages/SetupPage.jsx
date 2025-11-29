import React, { useState, useEffect } from 'react';
import { dataStore } from '../data/store';
import { Save, Plus, Trash2, School, Users, GraduationCap, UserCog, Baby } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './SetupPage.css';

const SetupPage = () => {
    const [activeTab, setActiveTab] = useState('school');
    const [schoolInfo, setSchoolInfo] = useState({ name: '', address: '' });
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [parents, setParents] = useState([]);
    const { addToast } = useToast();

    // Form States
    const [newClass, setNewClass] = useState('');
    const [newStudent, setNewStudent] = useState({ name: '', classId: '', parentName: '' });
    const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', email: '', password: '', classId: '' });
    const [newParent, setNewParent] = useState({ name: '', email: '', password: '', studentId: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setSchoolInfo(dataStore.getSchoolInfo());
        setClasses(dataStore.getClasses());
        setStudents(dataStore.getStudents());
        setTeachers(dataStore.getTeachers());
        setParents(dataStore.getParents());
    };

    const handleSaveSchool = (e) => {
        e.preventDefault();
        dataStore.saveSchoolInfo(schoolInfo);
        addToast('Success', 'School info saved!', 'success');
    };

    const handleAddClass = (e) => {
        e.preventDefault();
        if (!newClass) return;
        dataStore.addClass({ name: newClass });
        setNewClass('');
        loadData();
        addToast('Success', 'Class added successfully!', 'success');
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.classId) return;
        dataStore.addStudent(newStudent);
        setNewStudent({ name: '', classId: '', parentName: '' });
        loadData();
        addToast('Success', 'Student added successfully!', 'success');
    };

    const handleAddTeacher = (e) => {
        e.preventDefault();
        if (!newTeacher.name || !newTeacher.password) return;
        dataStore.addTeacher(newTeacher);
        setNewTeacher({ name: '', subject: '', email: '', password: '', classId: '' });
        loadData();
        addToast('Success', 'Teacher added successfully!', 'success');
    };

    const handleAddParent = (e) => {
        e.preventDefault();
        if (!newParent.name || !newParent.password) return;

        const parentData = {
            name: newParent.name,
            email: newParent.email,
            password: newParent.password,
            studentIds: newParent.studentId ? [newParent.studentId] : []
        };

        dataStore.addParent(parentData);
        setNewParent({ name: '', email: '', password: '', studentId: '' });
        loadData();
        addToast('Success', 'Parent account created!', 'success');
    };

    const tabs = [
        { id: 'school', label: 'School Info', icon: School },
        { id: 'classes', label: 'Classes', icon: GraduationCap },
        { id: 'students', label: 'Students', icon: Baby },
        { id: 'teachers', label: 'Teachers', icon: UserCog },
        { id: 'parents', label: 'Parents', icon: Users },
    ];

    return (
        <div className="setup-container">
            <div className="setup-sidebar">
                <h2>Admin Setup</h2>
                <div className="setup-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="setup-content">
                {activeTab === 'school' && (
                    <div className="setup-section">
                        <h3>School Information</h3>
                        <form onSubmit={handleSaveSchool} className="setup-form">
                            <div className="form-group">
                                <label>School Name</label>
                                <input
                                    type="text"
                                    value={schoolInfo.name}
                                    onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                                    placeholder="Enter School Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={schoolInfo.address}
                                    onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                                    placeholder="Enter School Address"
                                />
                            </div>
                            <button type="submit" className="save-btn">
                                <Save size={18} /> Save Changes
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'classes' && (
                    <div className="setup-section">
                        <h3>Manage Classes</h3>
                        <form onSubmit={handleAddClass} className="inline-form">
                            <input
                                type="text"
                                value={newClass}
                                onChange={(e) => setNewClass(e.target.value)}
                                placeholder="New Class Name (e.g. Class 6A)"
                            />
                            <button type="submit" className="add-btn"><Plus size={18} /> Add Class</button>
                        </form>
                        <div className="list-container">
                            {classes.map(c => (
                                <div key={c.id} className="list-item">
                                    <span>{c.name}</span>
                                    <span className="item-id">ID: {c.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="setup-section">
                        <h3>Manage Students</h3>
                        <form onSubmit={handleAddStudent} className="setup-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    value={newStudent.name}
                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    placeholder="Student Name"
                                />
                                <select
                                    value={newStudent.classId}
                                    onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newStudent.parentName}
                                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                                    placeholder="Parent Name"
                                />
                            </div>
                            <button type="submit" className="add-btn"><Plus size={18} /> Add Student</button>
                        </form>
                        <div className="list-container">
                            {students.map(s => (
                                <div key={s.id} className="list-item">
                                    <div className="item-details">
                                        <strong>{s.name}</strong>
                                        <span>Class: {classes.find(c => c.id === s.classId)?.name || 'Unknown'}</span>
                                        <span>Parent: {s.parentName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'teachers' && (
                    <div className="setup-section">
                        <h3>Manage Teachers</h3>
                        <form onSubmit={handleAddTeacher} className="setup-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    value={newTeacher.name}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                    placeholder="Teacher Name"
                                />
                                <input
                                    type="text"
                                    value={newTeacher.subject}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                                    placeholder="Subject"
                                />
                                <input
                                    type="email"
                                    value={newTeacher.email}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    placeholder="Email / ID"
                                />
                                <input
                                    type="text"
                                    value={newTeacher.password}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                    placeholder="Password"
                                />
                                <select
                                    value={newTeacher.classId}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, classId: e.target.value })}
                                >
                                    <option value="">Assign Class (Optional)</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="add-btn"><Plus size={18} /> Add Teacher</button>
                        </form>
                        <div className="list-container">
                            {teachers.map(t => (
                                <div key={t.id} className="list-item">
                                    <div className="item-details">
                                        <strong>{t.name}</strong>
                                        <span>Subject: {t.subject}</span>
                                        <span>Email/ID: {t.email}</span>
                                        <span>Password: {t.password}</span>
                                        <span>Class: {classes.find(c => c.id === t.classId)?.name || 'None'}</span>
                                    </div>
                                    <button onClick={() => { dataStore.deleteTeacher(t.id); loadData(); }} className="icon-btn text-danger">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'parents' && (
                    <div className="setup-section">
                        <h3>Manage Parents</h3>
                        <form onSubmit={handleAddParent} className="setup-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    value={newParent.name}
                                    onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                                    placeholder="Parent Name"
                                />
                                <input
                                    type="email"
                                    value={newParent.email}
                                    onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                                    placeholder="Email / ID"
                                />
                                <input
                                    type="text"
                                    value={newParent.password}
                                    onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
                                    placeholder="Password"
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '0.5rem' }}>
                                <label>Link Student</label>
                                <select
                                    value={newParent.studentId}
                                    onChange={(e) => setNewParent({ ...newParent, studentId: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="">-- Select Student --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} (Class: {classes.find(c => c.id === s.classId)?.name})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="add-btn"><Plus size={18} /> Add Parent Account</button>
                        </form>
                        <div className="list-container">
                            {parents.map(p => (
                                <div key={p.id} className="list-item">
                                    <div className="item-details">
                                        <strong>{p.name}</strong>
                                        <span>Email/ID: {p.email}</span>
                                        <span>Password: {p.password}</span>
                                        <span>
                                            Student: {p.studentIds && p.studentIds.length > 0
                                                ? students.find(s => s.id === p.studentIds[0])?.name
                                                : 'None'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SetupPage;
