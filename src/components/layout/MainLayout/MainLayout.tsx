import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { SideNav, TopNav } from '@/components/navigation';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // State for sidebar (Desktop defaults to open/expanded, Mobile hidden)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initial Responsive Check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Run on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
  };

  return (
    <div className={styles.container}>
      {/* 1. Sticky Header */}
      <TopNav
        isLoggedIn={!!user}
        user={user || undefined}
        onLogout={handleLogout}
        isSidebarCollapsed={!isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        className={styles.header}
      />

      {/* 2. Layout Body */}
      <div className={styles.body}>
        {/* Fixed Sidebar */}
        <SideNav
          isLoggedIn={!!user}
          user={user || undefined}
          isCollapsed={!isSidebarOpen} // Desktop functionality
          isOpen={isMobileOpen} // Mobile functionality
          onClose={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <main
          className={clsx(
            styles.main,
            isSidebarOpen ? styles.mainShifted : styles.mainCollapsed
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
