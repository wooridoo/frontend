import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVote } from '@/hooks/useVote';
import { useChallengeMeetings } from '@/hooks/useMeeting';
import { useMembers } from '@/hooks/useMember';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, Input } from '@/components/ui';
import type { VoteType } from '@/types/vote';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './CreateVote.module.css';

interface VoteForm {
  type: VoteType;
  title: string;
  description: string;
  deadline: string;
  meetingId: string;
  targetId: string;
  amount: string;
  receiptUrl: string;
}

const initialForm: VoteForm = {
  type: 'EXPENSE',
  title: '',
  description: '',
  deadline: '',
  meetingId: '',
  targetId: '',
  amount: '',
  receiptUrl: '',
};

export function CreateVote() {
  const { challengeId, challengeRef } = useChallengeRoute();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: createVote, isPending } = useCreateVote(challengeId);
  const { data: meetings = [] } = useChallengeMeetings(challengeId);
  const { data: membersData } = useMembers(challengeId, 'ACTIVE');

  const [form, setForm] = useState<VoteForm>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const kickCandidates = useMemo(
    () => (membersData?.members || []).filter((member) => member.user.userId !== user?.userId && member.role !== 'LEADER'),
    [membersData?.members, user?.userId],
  );

  const getMinDateTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const validate = () => {
    if (!form.title.trim()) return '투표 제목을 입력해주세요.';
    if (!form.deadline) return '마감 일시를 입력해주세요.';

    if (form.type === 'EXPENSE') {
      if (!form.meetingId) return '지출 승인 투표는 모임 선택이 필요합니다.';
      const amount = Number(form.amount);
      if (!Number.isFinite(amount) || amount <= 0) return '지출 금액을 확인해주세요.';
    }
    if (form.type === 'KICK' && !form.targetId) {
      return '강퇴 대상 멤버를 선택해주세요.';
    }

    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      deadline: form.deadline,
      targetId: form.type === 'KICK' ? form.targetId : undefined,
      meetingId: form.type === 'EXPENSE' ? form.meetingId : undefined,
      amount: form.type === 'EXPENSE' ? Number(form.amount) : undefined,
      receiptUrl: form.type === 'EXPENSE' ? form.receiptUrl.trim() || undefined : undefined,
    };

    createVote(payload, {
      onSuccess: () => {
        navigate(CHALLENGE_ROUTES.votes(challengeRef || challengeId));
      },
      onError: (err) => {
        setError(err.message || '투표 생성에 실패했습니다.');
      },
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>새 투표 생성</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>투표 유형</label>
          <select
            value={form.type}
            onChange={(e) => {
              setForm({ ...form, type: e.target.value as VoteType });
              setError(null);
            }}
            className={styles.select}
          >
            <option value="EXPENSE">지출 승인</option>
            <option value="KICK">멤버 강퇴</option>
            <option value="LEADER_KICK">리더 강퇴</option>
            <option value="DISSOLVE">챌린지 해산</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>제목</label>
          <Input
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setError(null);
            }}
            placeholder="투표 제목을 입력하세요"
            required
          />
        </div>

        <div className={styles.field}>
          <label>설명</label>
          <textarea
            value={form.description}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
              setError(null);
            }}
            placeholder="상세 내용을 입력하세요"
            className={styles.textarea}
            rows={4}
          />
        </div>

        {form.type === 'EXPENSE' ? (
          <>
            <div className={styles.field}>
              <label>대상 모임</label>
              <select
                value={form.meetingId}
                onChange={(e) => {
                  setForm({ ...form, meetingId: e.target.value });
                  setError(null);
                }}
                className={styles.select}
              >
                <option value="">모임을 선택하세요</option>
                {meetings.map((meeting) => (
                  <option key={meeting.meetingId} value={meeting.meetingId}>
                    {meeting.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>지출 금액</label>
              <Input
                type="number"
                min={1}
                value={form.amount}
                onChange={(e) => {
                  setForm({ ...form, amount: e.target.value });
                  setError(null);
                }}
                placeholder="금액을 입력하세요"
              />
            </div>

            <div className={styles.field}>
              <label>영수증 주소(선택)</label>
              <Input
                value={form.receiptUrl}
                onChange={(e) => setForm({ ...form, receiptUrl: e.target.value })}
                placeholder="영수증 주소를 입력하세요"
              />
            </div>
          </>
        ) : null}

        {form.type === 'KICK' ? (
          <div className={styles.field}>
            <label>강퇴 대상 멤버</label>
            <select
              value={form.targetId}
              onChange={(e) => {
                setForm({ ...form, targetId: e.target.value });
                setError(null);
              }}
              className={styles.select}
            >
              <option value="">멤버를 선택하세요</option>
              {kickCandidates.map((member) => (
                <option key={member.user.userId} value={member.user.userId}>
                  {member.user.nickname}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {form.type === 'LEADER_KICK' ? (
          <p className={styles.helper}>
            최근 30일 리더 활동 조건을 백엔드가 검증합니다. 조건 미충족 시 생성이 거부됩니다.
          </p>
        ) : null}

        {form.type === 'DISSOLVE' ? (
          <p className={styles.helper}>
            해산 투표는 100% 동의가 필요합니다. 반대 1표라도 있으면 즉시 부결됩니다.
          </p>
        ) : null}

        <div className={styles.field}>
          <label>마감 일시 (최소 24시간 후)</label>
          <input
            type="datetime-local"
            value={form.deadline}
            min={getMinDateTime()}
            onChange={(e) => {
              setForm({ ...form, deadline: e.target.value });
              setError(null);
            }}
            className={styles.dateInput}
            required
          />
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? '생성 중...' : '투표 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}
