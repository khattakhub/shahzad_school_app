import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, BookOpen, Users, Menu, X, LogOut, Settings } from 'lucide-react';
import { dataStore } from '../data/store';
import './Layout.css';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

const Layout = ({ onLogout, role }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [schoolName, setSchoolName] = useState('SchoolApp');
    const location = useLocation();

    useEffect(() => {
        const info = dataStore.getSchoolInfo();
        if (info && info.name) {
            setSchoolName(info.name);
        }
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <div className="layout-container">
            {/* Sidebar - Desktop */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="app-logo">
                        <BookOpen className="text-primary" />
                        {schoolName}
                    </h1>
                </div>

                <nav className="sidebar-nav">
                    {role === 'teacher' && (
                        <>
                            <div className="nav-section-label">Teacher</div>
                            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                            <SidebarItem to="/attendance" icon={CalendarCheck} label="Attendance" />
                            <SidebarItem to="/diary" icon={BookOpen} label="Diary" />
                        </>
                    )}

                    {role === 'admin' && (
                        <>
                            <div className="nav-section-label">Admin</div>
                            <SidebarItem to="/setup" icon={Settings} label="Setup School" />
                        </>
                    )}

                    <div className="nav-section-label" style={{ marginTop: '2rem' }}>Parent View</div>
                    <SidebarItem to="/parent" icon={Users} label="Parent Portal" />
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {role === 'teacher' ? 'T' : role === 'admin' ? 'A' : 'P'}
                        </div>
                        <div className="user-info">
                            <p className="user-name">{role === 'admin' ? 'Administrator' : `${role} Demo`}</p>
                            <p className="user-role">
                                {role === 'teacher' ? 'Class 5A' : role === 'admin' ? 'School Admin' : 'Parent'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="logout-btn"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="main-content">
                {/* Mobile Header */}
                <header className="mobile-header">
                    <h1 className="app-logo" style={{ fontSize: '1.25rem' }}>{schoolName}</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="menu-btn">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-overlay">
                        <nav className="sidebar-nav">
                            {role === 'teacher' && (
                                <>
                                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                                    <SidebarItem to="/attendance" icon={CalendarCheck} label="Attendance" />
                                    <SidebarItem to="/diary" icon={BookOpen} label="Diary" />
                                </>
                            )}
                            {role === 'admin' && (
                                <SidebarItem to="/setup" icon={Settings} label="Setup School" />
                            )}
                            <SidebarItem to="/parent" icon={Users} label="Parent Portal" />
                            <button
                                onClick={onLogout}
                                className="logout-btn"
                                style={{ marginTop: '1rem', justifyContent: 'center' }}
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                {/* Main Content */}
                <main className="content-scroll">
                    <div className="content-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
