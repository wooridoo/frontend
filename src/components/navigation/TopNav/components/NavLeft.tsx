import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { IconButton } from '@/components/ui';
import styles from './NavLeft.module.css';
import logo from '@/assets/woorido_logo.svg';
import { PATHS } from '@/routes/paths';

interface NavLeftProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function NavLeft({ isSidebarCollapsed, onToggleSidebar }: NavLeftProps) {
  return (
    <div className={styles.root}>
      {/* 보조 설명 */}
      <IconButton
        icon={<Menu size={24} />}
        className={styles.menuButton}
        onClick={onToggleSidebar}
        aria-label={isSidebarCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
        size="md"
        variant="ghost"
      />

      {/* 보조 설명 */}
      <Link to={PATHS.HOME} className={styles.logoLink}>
        <img src={logo} alt="우리두" className={styles.logo} />
      </Link>
    </div>
  );
}
