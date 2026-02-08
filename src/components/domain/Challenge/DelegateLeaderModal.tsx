import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useDelegateLeaderModalStore } from '@/store/useDelegateLeaderModalStore';
import styles from './CreateChallengeModal.module.css';

// Mock members data
const MOCK_MEMBERS = [
    { memberId: '1', nickname: '홍길동', profileImage: 'https://picsum.photos/seed/m1/100/100' },
    { memberId: '2', nickname: '김철수', profileImage: 'https://picsum.photos/seed/m2/100/100' },
    { memberId: '3', nickname: '이영희', profileImage: 'https://picsum.photos/seed/m3/100/100' },
    { memberId: '4', nickname: '박민수', profileImage: 'https://picsum.photos/seed/m4/100/100' },
];

export function DelegateLeaderModal() {
    const { isOpen, currentLeaderId, onClose } = useDelegateLeaderModalStore();
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const members = MOCK_MEMBERS.filter(m => m.memberId !== currentLeaderId);

    const handleClose = () => {
        setSelectedMember(null);
        onClose();
    };

    const handleDelegate = async () => {
        if (!selectedMember) return;

        setIsSubmitting(true);
        // API call would go here
        await new Promise(r => setTimeout(r, 1000));
        setIsSubmitting(false);
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>리더 위임</h2>

                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    챌린지 리더 권한을 다른 멤버에게 위임합니다.<br />
                    위임 후에는 일반 멤버로 변경됩니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                    {members.map((member) => (
                        <button
                            key={member.memberId}
                            onClick={() => setSelectedMember(member.memberId)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                border: selectedMember === member.memberId ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                background: selectedMember === member.memberId ? 'rgba(var(--color-primary-rgb), 0.05)' : 'var(--color-surface)',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <img
                                src={member.profileImage}
                                alt={member.nickname}
                                style={{ width: 40, height: 40, borderRadius: '50%' }}
                            />
                            <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
                                {member.nickname}
                            </span>
                            {selectedMember === member.memberId && (
                                <span style={{ marginLeft: 'auto', color: 'var(--color-primary)' }}>✓</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className={styles.actions}>
                    <Button onClick={handleClose} className={styles.cancelButton}>
                        취소
                    </Button>
                    <Button
                        onClick={handleDelegate}
                        className={styles.submitButton}
                        disabled={!selectedMember || isSubmitting}
                    >
                        {isSubmitting ? '처리 중...' : '위임하기'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
