import { Crown, EllipsisVertical } from 'lucide-react';
import type { ChallengeInfo } from '@/lib/api/challenge';
import { formatCurrency } from '@/utils/format';
import { Skeleton } from '@/components/feedback';
import { ChallengeStatus } from '@/types/enums';
import { getCategoryLabel } from '@/lib/utils/categoryLabels';
import { SemanticIcon } from '@/components/ui';
import { ResponsiveOverlay } from '@/components/ui/Overlay/ResponsiveOverlay';
import {
  useDeleteChallengeModalStore,
  useDelegateLeaderModalStore,
  useEditChallengeModalStore,
  useLeaveChallengeModalStore,
  useSupportPaymentModalStore,
  useSupportSettingsModalStore,
} from '@/store/modal/useModalStore';
import styles from './ChallengeHero.module.css';

interface ChallengeHeroProps {
  challenge: ChallengeInfo;
}

const CHALLENGE_FALLBACK_IMAGE = '/images/challenge-fallback.svg';

export function ChallengeHero({ challenge }: ChallengeHeroProps) {
  const { onOpen: openEditChallenge } = useEditChallengeModalStore();
  const { onOpen: openDeleteChallenge } = useDeleteChallengeModalStore();
  const { onOpen: openLeaveChallenge } = useLeaveChallengeModalStore();
  const { onOpen: openDelegateLeader } = useDelegateLeaderModalStore();
  const { onOpen: openSupportSettings } = useSupportSettingsModalStore();
  const { onOpen: openSupportPayment } = useSupportPaymentModalStore();

  const isLeader = challenge.myMembership?.role === 'LEADER';
  const isMember = Boolean(challenge.myMembership?.memberId);
  const leaderUserId = (challenge.leader as { userId?: string; id?: string }).userId
    || (challenge.leader as { id?: string }).id
    || '';

  const { title, description, category, memberCount, supportAmount, leader, thumbnailUrl, status } = challenge;

  return (
    <div className={styles.hero}>
      <div className={styles.cover}>
        <img
          alt="챌린지 대표 이미지"
          className={styles.coverImage}
          onError={e => {
            (e.target as HTMLImageElement).src = CHALLENGE_FALLBACK_IMAGE;
          }}
          src={thumbnailUrl || CHALLENGE_FALLBACK_IMAGE}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <SemanticIcon name="challenge" size={28} />
        </div>

        <div className={styles.info}>
          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{getCategoryLabel(category)}</span>
            {status === ChallengeStatus.IN_PROGRESS ? <span className={styles.certBadge}>진행중</span> : null}
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{description || '챌린지 소개가 없습니다.'}</p>

          <div className={styles.meta}>
            <div className={styles.participants}>
              <SemanticIcon animated={false} name="member" size={14} /> {memberCount.current}/{memberCount.max}명
            </div>
            <div className={styles.separator}>·</div>
            <div className={styles.fee}>월 서포트 {formatCurrency(supportAmount)}</div>
            <div className={styles.separator}>·</div>

            <div className={styles.leaderBadge}>
              <div className={styles.leaderIcon}>
                <Crown className="text-white" size={12} />
              </div>
              <span className={styles.leaderLabel}>리더</span>
              <span className={styles.leaderName}>{leader.nickname}</span>
              <span className={styles.leaderScore}>
                <SemanticIcon animated={false} name="success" size={12} /> {leader.brix} 브릭스
              </span>
            </div>

            {isMember ? (
              <>
                <div className={styles.separator}>·</div>
                <ResponsiveOverlay
                  align="end"
                  desktopContentClassName={styles.managementOverlay}
                  mobileContentClassName={styles.managementOverlay}
                  title="챌린지 관리"
                  trigger={(
                    <button type="button" className={styles.manageButton}>
                      <EllipsisVertical size={14} />
                      관리
                    </button>
                  )}
                >
                  <div className={styles.managementMenu}>
                    <button
                      type="button"
                      className={styles.managementItem}
                      onClick={() => openSupportPayment(challenge.challengeId, challenge.supportAmount)}
                    >
                      서포트 결제
                    </button>
                    <button
                      type="button"
                      className={styles.managementItem}
                      onClick={() => openSupportSettings(challenge.challengeId)}
                    >
                      서포트 설정
                    </button>
                    {isLeader ? (
                      <>
                        <button
                          type="button"
                          className={styles.managementItem}
                          onClick={() => openEditChallenge(challenge)}
                        >
                          챌린지 수정
                        </button>
                        <button
                          type="button"
                          className={styles.managementItem}
                          onClick={() => openDelegateLeader(challenge.challengeId, leaderUserId)}
                        >
                          리더 위임
                        </button>
                        <button
                          type="button"
                          className={`${styles.managementItem} ${styles.managementDanger}`}
                          onClick={() => openDeleteChallenge(challenge.challengeId, challenge.title)}
                        >
                          챌린지 삭제
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.managementItem} ${styles.managementDanger}`}
                        onClick={() => openLeaveChallenge(challenge.challengeId, challenge.title)}
                      >
                        챌린지 나가기
                      </button>
                    )}
                  </div>
                </ResponsiveOverlay>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.cover} />
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Skeleton height={40} width={40} />
        </div>
        <div className={styles.info}>
          <div style={{ marginBottom: 10 }}>
            <Skeleton height={32} width={200} />
          </div>
          <Skeleton height={20} width={300} />
        </div>
      </div>
    </div>
  );
}
