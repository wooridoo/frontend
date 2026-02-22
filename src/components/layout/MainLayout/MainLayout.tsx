import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { SideNav, TopNav } from '@/components/navigation';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './MainLayout.module.css';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // 보조 처리
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 보조 처리
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // 보조 처리
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    document.body.style.setProperty('overflow', 'hidden');
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMobileOpen]);

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
      {/* 보조 설명 */}
      <TopNav
        isLoggedIn={!!user}
        user={user || undefined}
        onLogout={handleLogout}
        isSidebarCollapsed={!isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        className={styles.header}
      />

      {/* 보조 설명 */}
      <div className={styles.body}>
        {/* 보조 설명 */}
        <SideNav
          isCollapsed={!isSidebarOpen} // ?? ??
          isOpen={isMobileOpen} // ?? ??
          onClose={() => setIsMobileOpen(false)}
        />

        {/* 보조 설명 */}
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
