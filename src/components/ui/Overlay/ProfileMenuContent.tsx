import clsx from 'clsx';
import { SidebarIcon } from '@/components/ui/Icons';
import { BrixBadge } from '@/components/domain/BrixBadge';
import { getBrixGrade, formatBrix } from '@/lib/brix';
import type { User } from '@/types/user';
import { PATHS } from '@/routes/paths';
import { Button } from '../Button';
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
                        <img src={user.profileImage} alt={user.name || user.nickname} className={styles.avatarImg} />
                    ) : (
                        <span className={styles.avatarFallback}>{(user.name || user.nickname || '?').charAt(0)}</span>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.name || user.nickname || '알 수 없음'}</span>
                    <div className={styles.userBrix}>
                        <BrixBadge grade={getBrixGrade(user.brix)} variant="flat" size="sm" showLabel={false} />
                        <span className={styles.brixValue}>{formatBrix(user.brix)} 브릭스</span>
                    </div>
                </div>
            </div>

            <div className={styles.separator} />

            <Button
                className={styles.menuItem}
                fullWidth
                leadingIcon={<SidebarIcon type="profile" size={24} />}
                onClick={() => onNavigate(PATHS.MY.PROFILE)}
                variant="ghost"
            >
                마이페이지
            </Button>
            <Button
                className={styles.menuItem}
                fullWidth
                leadingIcon={<SidebarIcon type="feed" size={24} />}
                onClick={() => onNavigate(PATHS.MY.CHALLENGES)}
                variant="ghost"
            >
                나의 챌린지
            </Button>
            <Button
                className={styles.menuItem}
                fullWidth
                leadingIcon={<SidebarIcon type="ledger" size={24} />}
                onClick={() => onNavigate(PATHS.MY.LEDGER)}
                variant="ghost"
            >
                나의 장부
            </Button>

            <div className={styles.separator} />

            <Button
                className={styles.menuItem}
                fullWidth
                leadingIcon={<SidebarIcon type="settings" size={24} />}
                onClick={() => onNavigate(PATHS.MY.SETTINGS)}
                variant="ghost"
            >
                설정
            </Button>
            <Button
                className={clsx(styles.menuItem, styles.logout)}
                fullWidth
                leadingIcon={<SidebarIcon type="logout" size={24} />}
                onClick={onLogout}
                variant="ghost"
            >
                로그아웃
            </Button>
        </div>
    );
}
