import { MOCK_CLASSES, MOCK_STUDENTS } from './mockData';

const STORAGE_KEYS = {
    ATTENDANCE: 'school_app_attendance',
    DIARY: 'school_app_diary',
    SCHOOL_INFO: 'school_app_info',
    CLASSES: 'school_app_classes',
    STUDENTS: 'school_app_students',
    TEACHERS: 'school_app_teachers',
    PARENTS: 'school_app_parents'
};

// Helper to get data from storage
const getFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
};

// Helper to save data to storage
const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Data
const initializeData = () => {
    // Classes
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
        saveToStorage(STORAGE_KEYS.CLASSES, MOCK_CLASSES);
    }
    // Students
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        saveToStorage(STORAGE_KEYS.STUDENTS, MOCK_STUDENTS);
    }
    // School Info
    if (!localStorage.getItem(STORAGE_KEYS.SCHOOL_INFO)) {
        saveToStorage(STORAGE_KEYS.SCHOOL_INFO, { name: 'Demo School', address: '123 Education Lane' });
    }
    // Parents (Mock)
    if (!localStorage.getItem(STORAGE_KEYS.PARENTS)) {
        // Create a mock parent for the first student
        const mockParent = {
            id: 'p1',
            name: 'Mrs. Johnson',
            email: 'parent@school.com',
            password: 'password',
            studentIds: ['s1']
        };
        saveToStorage(STORAGE_KEYS.PARENTS, [mockParent]);
    }

    // Teachers (Mock)
    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
        const mockTeacher = {
            id: 't1',
            name: 'Mr. Anderson',
            subject: 'Mathematics',
            email: 'teacher@school.com',
            password: 'password',
            classId: 'c1'
        };
        saveToStorage(STORAGE_KEYS.TEACHERS, [mockTeacher]);
    }

    // Historical Attendance
    const existing = getFromStorage(STORAGE_KEYS.ATTENDANCE, null);
    if (!existing) {
        const history = {};
        const today = new Date();
        const students = MOCK_STUDENTS.filter(s => s.classId === 'c1');

        // Generate for last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const key = `${dateStr}-c1`;

            const dailyRecord = {};
            students.forEach(s => {
                // Random status: 80% Present, 10% Absent, 10% Late
                const rand = Math.random();
                if (rand > 0.2) dailyRecord[s.id] = 'present';
                else if (rand > 0.1) dailyRecord[s.id] = 'absent';
                else dailyRecord[s.id] = 'late';
            });
            history[key] = dailyRecord;
        }
        saveToStorage(STORAGE_KEYS.ATTENDANCE, history);
    }
};

// Run initialization
initializeData();

export const dataStore = {
    // School Info
    getSchoolInfo: () => getFromStorage(STORAGE_KEYS.SCHOOL_INFO, {}),
    saveSchoolInfo: (info) => saveToStorage(STORAGE_KEYS.SCHOOL_INFO, info),

    // Classes
    getClasses: () => getFromStorage(STORAGE_KEYS.CLASSES, []),
    addClass: (newClass) => {
        const classes = getFromStorage(STORAGE_KEYS.CLASSES, []);
        classes.push({ ...newClass, id: Date.now().toString() });
        saveToStorage(STORAGE_KEYS.CLASSES, classes);
    },

    // Students
    getStudents: (classId) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, []);
        if (!classId) return students;
        return students.filter(s => s.classId === classId);
    },
    addStudent: (student) => {
        const students = getFromStorage(STORAGE_KEYS.STUDENTS, []);
        students.push({ ...student, id: Date.now().toString() });
        saveToStorage(STORAGE_KEYS.STUDENTS, students);
    },

    // Teachers & Parents (Accounts)
    getTeachers: () => getFromStorage(STORAGE_KEYS.TEACHERS, []),
    addTeacher: (teacher) => {
        const teachers = getFromStorage(STORAGE_KEYS.TEACHERS, []);
        teachers.push({ ...teacher, id: Date.now().toString() });
        saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
    },
    deleteTeacher: (id) => {
        const teachers = getFromStorage(STORAGE_KEYS.TEACHERS, []);
        const updated = teachers.filter(t => t.id !== id);
        saveToStorage(STORAGE_KEYS.TEACHERS, updated);
    },

    getParents: () => getFromStorage(STORAGE_KEYS.PARENTS, []),
    addParent: (parent) => {
        const parents = getFromStorage(STORAGE_KEYS.PARENTS, []);
        // Ensure studentIds is an array
        const newParent = {
            ...parent,
            id: Date.now().toString(),
            studentIds: parent.studentIds || []
        };
        parents.push(newParent);
        saveToStorage(STORAGE_KEYS.PARENTS, parents);
    },

    validateParent: (idOrEmail, password) => {
        const parents = getFromStorage(STORAGE_KEYS.PARENTS, []);
        return parents.find(p => (p.email === idOrEmail || p.id === idOrEmail) && p.password === password);
    },

    validateTeacher: (idOrEmail, password) => {
        const teachers = getFromStorage(STORAGE_KEYS.TEACHERS, []);
        // Check if it matches email or ID
        return teachers.find(t => (t.email === idOrEmail || t.id === idOrEmail) && t.password === password);
    },

    getParentStudents: (parentId) => {
        const parents = getFromStorage(STORAGE_KEYS.PARENTS, []);
        const parent = parents.find(p => p.id === parentId);
        if (!parent || !parent.studentIds) return [];

        const allStudents = getFromStorage(STORAGE_KEYS.STUDENTS, []);
        return allStudents.filter(s => parent.studentIds.includes(s.id));
    },

    // Attendance
    saveAttendance: (date, classId, records) => {
        const allAttendance = getFromStorage(STORAGE_KEYS.ATTENDANCE, {});
        const key = `${date}-${classId}`;
        allAttendance[key] = records;
        saveToStorage(STORAGE_KEYS.ATTENDANCE, allAttendance);
    },

    getAttendance: (date, classId) => {
        const allAttendance = getFromStorage(STORAGE_KEYS.ATTENDANCE, {});
        const key = `${date}-${classId}`;
        return allAttendance[key] || {};
    },

    getAttendanceStats: (classId) => {
        const allAttendance = getFromStorage(STORAGE_KEYS.ATTENDANCE, {});
        const stats = [];
        const today = new Date();

        // Get last 7 days stats
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const key = `${dateStr}-${classId}`;
            const records = allAttendance[key] || {};

            const counts = { date: dateStr.slice(5), present: 0, absent: 0, late: 0 }; // slice to show MM-DD
            Object.values(records).forEach(status => {
                if (counts[status] !== undefined) counts[status]++;
            });
            stats.push(counts);
        }
        return stats;
    },

    getStudentAttendanceHistory: (studentId) => {
        const allAttendance = getFromStorage(STORAGE_KEYS.ATTENDANCE, {});
        const history = [];
        Object.entries(allAttendance).forEach(([key, records]) => {
            if (records[studentId]) {
                const [date] = key.split('-'); // simple parsing, assuming YYYY-MM-DD
                history.push({ date, status: records[studentId] });
            }
        });
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Diary
    sendDiary: (entry) => {
        const diaries = getFromStorage(STORAGE_KEYS.DIARY, []);
        const newEntry = { ...entry, id: Date.now().toString(), timestamp: new Date().toISOString() };
        diaries.push(newEntry);
        saveToStorage(STORAGE_KEYS.DIARY, diaries);
    },

    getDiaries: (classId, studentId = null) => {
        const diaries = getFromStorage(STORAGE_KEYS.DIARY, []);
        return diaries.filter(d => {
            // If studentId is provided (Parent View), show class diaries OR specific student diaries
            if (studentId) {
                return (d.classId === classId && d.target === 'all') || (d.target === 'student' && d.studentId === studentId);
            }
            // Teacher view: show all for class
            return d.classId === classId;
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // New: Get Student Performance Data (Mock)
    getStudentPerformance: (studentId) => {
        // Deterministic mock based on ID to keep it consistent but different per student
        const seed = studentId.charCodeAt(1) || 50;
        return [
            { subject: 'Math', A: Math.min(100, seed + 10), fullMark: 100 },
            { subject: 'Science', A: Math.min(100, seed + 20), fullMark: 100 },
            { subject: 'English', A: Math.min(100, seed - 5), fullMark: 100 },
            { subject: 'History', A: Math.min(100, seed + 5), fullMark: 100 },
            { subject: 'Art', A: Math.min(100, seed + 15), fullMark: 100 },
            { subject: 'PE', A: Math.min(100, seed + 25), fullMark: 100 },
        ];
    },

    // New: Get Class Assignment Stats (Mock)
    getClassAssignmentStats: (classId) => {
        return [
            { name: 'Mon', submitted: 24, pending: 4 },
            { name: 'Tue', submitted: 20, pending: 8 },
            { name: 'Wed', submitted: 26, pending: 2 },
            { name: 'Thu', submitted: 22, pending: 6 },
            { name: 'Fri', submitted: 28, pending: 0 },
        ];
    }
};
