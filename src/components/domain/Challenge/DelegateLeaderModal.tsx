import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useDelegateLeaderModalStore } from '@/store/modal/useModalStore';
import { getChallengeMembers, delegateLeader } from '@/lib/api/member';
import type { Member } from '@/types/member';
import styles from './DelegateLeaderModal.module.css';

const AVATAR_FALLBACK = '/images/avatar-fallback.svg';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function DelegateLeaderModal() {
  const { isOpen, challengeId, currentLeaderId, onClose } = useDelegateLeaderModalStore();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isOpen || !challengeId) return;

      setLoading(true);
      try {
        const response = await getChallengeMembers(challengeId, 'ACTIVE');
        const leaderId = currentLeaderId || '';
        setMembers(response.members.filter((member) => member.user.userId !== leaderId));
      } catch (error) {
        console.error('리더 위임 대상 조회 실패:', error);
        toast.error('멤버 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    void fetchMembers();
  }, [challengeId, currentLeaderId, isOpen]);

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
      toast.success('리더 권한이 위임되었습니다.');
      handleClose();
    } catch (error) {
      console.error('리더 위임 실패:', error);
      toast.error('리더 위임에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
      <div className={styles.container}>
        <h2 className={styles.title}>리더 위임</h2>

        <p className={styles.description}>
          챌린지 리더 권한을 다른 멤버에게 위임합니다.
          <br />
          위임 후 본인은 일반 멤버로 전환됩니다.
        </p>

        {loading ? (
          <div className={styles.loading}>멤버 목록을 불러오는 중...</div>
        ) : (
          <div className={styles.memberList}>
            {members.length > 0 ? (
              members.map((member) => {
                const memberId = String(member.user.userId);
                const selected = selectedMember === memberId;

                return (
                  <button
                    key={member.memberId}
                    type="button"
                    onClick={() => setSelectedMember(memberId)}
                    className={`${styles.memberButton} ${selected ? styles.selectedMember : ''}`}
                  >
                    <img
                      src={member.user.profileImage || AVATAR_FALLBACK}
                      alt={member.user.nickname}
                      className={styles.avatar}
                    />
                    <span className={styles.memberName}>{member.user.nickname}</span>
                    {selected ? <span className={styles.selectedMark}>선택됨</span> : null}
                  </button>
                );
              })
            ) : (
              <div className={styles.empty}>위임 가능한 멤버가 없습니다.</div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Button onClick={handleClose} fullWidth variant="outline">
            취소
          </Button>
          <Button
            onClick={() => void handleDelegate()}
            disabled={!selectedMember || isSubmitting}
            fullWidth
            variant="primary"
          >
            {isSubmitting ? '처리 중...' : '위임하기'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
