import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useDelegateLeaderModalStore } from '@/store/modal/useModalStore';
import { getChallengeMembers, delegateLeader } from '@/lib/api/member';
import type { Member } from '@/types/member';
import styles from './CreateChallengeModal.module.css';

export function DelegateLeaderModal() {
    const { isOpen, challengeId, currentLeaderId, onClose } = useDelegateLeaderModalStore();
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            if (isOpen && challengeId) {
                setLoading(true);
                try {
                    const response = await getChallengeMembers(challengeId, 'ACTIVE');
                    // Filter out current leader
                    const requestLeaderId = currentLeaderId || '';
                    const filtered = response.members.filter(m => m.user.userId !== requestLeaderId);
                    setMembers(filtered);
                } catch (error) {
                    console.error('Failed to fetch members:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMembers();
    }, [isOpen, challengeId, currentLeaderId]);

    const handleClose = () => {
        setSelectedMember(null);
        setMembers([]);
        onClose();
    };

    const handleDelegate = async () => {
        if (!selectedMember || !challengeId) return;

        setIsSubmitting(true);
        try {
            await delegateLeader(challengeId, selectedMember);
            handleClose();
            // Optional: Refresh challenge data or notify success
        } catch (error) {
            console.error('Failed to delegate leader:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>由щ뜑 ?꾩엫</h2>

                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    梨뚮┛吏 由щ뜑 沅뚰븳???ㅻⅨ 硫ㅻ쾭?먭쾶 ?꾩엫?⑸땲??<br />
                    ?꾩엫 ?꾩뿉???쇰컲 硫ㅻ쾭濡?蹂寃쎈맗?덈떎.
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>濡쒕뵫 以?..</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', maxHeight: '300px', overflowY: 'auto' }}>
                        {members.length > 0 ? members.map((member) => (
                            <button
                                key={member.memberId}
                                onClick={() => setSelectedMember(String(member.user.userId))}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    border: selectedMember === String(member.user.userId) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    background: selectedMember === String(member.user.userId) ? 'rgba(var(--color-primary-rgb), 0.05)' : 'var(--color-surface)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <img
                                    src={member.user.profileImage}
                                    alt={member.user.nickname}
                                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                                />
                                <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
                                    {member.user.nickname}
                                </span>
                                {selectedMember === String(member.user.userId) && (
                                    <span style={{ marginLeft: 'auto', color: 'var(--color-primary)' }}>✓</span>
                                )}
                            </button>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-tertiary)' }}>
                                ?꾩엫?????덈뒗 硫ㅻ쾭媛 ?놁뒿?덈떎.
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.actions}>
                    <Button onClick={handleClose} className={styles.cancelButton}>
                        痍⑥냼
                    </Button>
                    <Button
                        onClick={handleDelegate}
                        className={styles.submitButton}
                        disabled={!selectedMember || isSubmitting}
                    >
                        {isSubmitting ? '泥섎━ 以?..' : '?꾩엫?섍린'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
