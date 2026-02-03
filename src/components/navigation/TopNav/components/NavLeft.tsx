import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import styles from './NavLeft.module.css';
import logo from '@/assets/woorido_logo.svg';
import { PATHS } from '@/routes/paths';

interface NavLeftProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function NavLeft({ isSidebarCollapsed, onToggleSidebar }: NavLeftProps) {
  return (
    <div className={styles.root}>
      {/* 1. Hamburger Menu */}
      <button
        className={styles.menuButton}
        onClick={onToggleSidebar}
        aria-label={isSidebarCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
      >
        <Menu size={24} />
      </button>

      {/* 2. Logo */}
      <Link to={PATHS.HOME} className={styles.logoLink}>
        <img src={logo} alt="우리두" className={styles.logo} />
      </Link>
    </div>
  );
}
