import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { SideNav } from '@/components/navigation/SideNav';
import { TopNav } from '@/components/navigation/TopNav';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock User State (Replace with specific Auth Context later)
  const isLoggedIn = true; // Temporary for verification
  const user = {
    name: '김우리',
    avatar: 'https://i.pravatar.cc/150?u=woorido',
    sugarScore: 72,
    balance: 154000
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className={clsx(styles.container, isSidebarCollapsed && styles.collapsed)}>
      <aside className={styles.sidebarArea}>
        <SideNav
          isCollapsed={isSidebarCollapsed}
          isLoggedIn={isLoggedIn}
          user={user}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </aside>

      <div className={styles.contentArea}>
        <TopNav
          isLoggedIn={isLoggedIn}
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className={styles.pageContent}>
          <Outlet context={{ isLoggedIn }} />
        </main>
      </div>
    </div>
  );
}
