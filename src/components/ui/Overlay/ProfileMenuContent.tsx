import clsx from 'clsx';
import { SidebarIcon } from '@/components/ui/Icons';
import { BrixBadge } from '@/components/domain/BrixBadge';
import { getBrixGrade, formatBrix } from '@/lib/brix';
import type { User } from '@/types/domain';
import { PATHS } from '@/routes/paths';
import styles from './ProfileMenu.module.css';

interface ProfileMenuContentProps {
    user: User;
    onNavigate: (path: string) => void;
    onLogout: () => void;
}

export function ProfileMenuContent({ user, onNavigate, onLogout }: ProfileMenuContentProps) {
    return (
        <div className={styles.menuContainer}>
            <div className={styles.userInfo}>
                <div className={styles.avatarLarge}>
                    {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className={styles.avatarImg} />
                    ) : (
                        <span className={styles.avatarFallback}>{user.name.charAt(0)}</span>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.name}</span>
                    <div className={styles.userBrix}>
                        <BrixBadge grade={getBrixGrade(user.brix)} variant="flat" size="sm" showLabel={false} />
                        <span className={styles.brixValue}>{formatBrix(user.brix)} Brix</span>
                    </div>
                </div>
            </div>

            <div className={styles.separator} />

            <button className={styles.menuItem} onClick={() => onNavigate(PATHS.MY.PROFILE)}>
                <SidebarIcon type="profile" size={24} />
                마이페이지
            </button>
            <button className={styles.menuItem} onClick={() => onNavigate(PATHS.MY.CHALLENGES)}>
                <SidebarIcon type="feed" size={24} />
                나의 챌린지
            </button>
            <button className={styles.menuItem} onClick={() => onNavigate(PATHS.MY.LEDGER)}>
                <SidebarIcon type="ledger" size={24} />
                나의 장부
            </button>

            <div className={styles.separator} />

            <button className={styles.menuItem} onClick={() => onNavigate(PATHS.MY.SETTINGS)}>
                <SidebarIcon type="settings" size={24} />
                설정
            </button>
            <button className={clsx(styles.menuItem, styles.logout)} onClick={onLogout}>
                <SidebarIcon type="logout" size={24} />
                로그아웃
            </button>
        </div>
    );
}
