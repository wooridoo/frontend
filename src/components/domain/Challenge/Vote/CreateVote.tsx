import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVote } from '../../../../hooks/useVote';
import { Button, Input } from '../../../../components/common';
import type { VoteType } from '../../../../types/domain';
import { useChallengeMeetings } from '@/hooks/useMeeting';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import styles from './CreateVote.module.css';

export function CreateVote() {
  const { challengeId, challengeRef } = useChallengeRoute();
  const navigate = useNavigate();
  const { mutate: createVote, isPending } = useCreateVote(challengeId);
  const { data: meetings, isLoading: isMeetingsLoading } = useChallengeMeetings(challengeId);

  const [form, setForm] = useState<{
    type: VoteType;
    title: string;
    description: string;
    meetingId: string;
    deadline: string;
  }>({
    type: 'EXPENSE',
    title: '',
    description: '',
    meetingId: '',
    deadline: ''
  });
  const [meetingError, setMeetingError] = useState('');

  const selectableMeetings = meetings.filter((meeting) => {
    const status = meeting.status?.toUpperCase() ?? '';
    const isCanceled = status === 'CANCELED' || status === 'CANCELLED';
    const confirmedCount = meeting.attendance?.confirmed ?? 0;
    return !isCanceled && confirmedCount > 0;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.deadline) return;
    if (form.type === 'EXPENSE' && !form.meetingId) {
      setMeetingError('지출 승인 투표는 모임 선택이 필요합니다.');
      return;
    }

    // TODO: Validate deadline is > 24h from now (logic in implementation plan)
    const payload: {
      type: 'EXPENSE' | 'KICK' | 'DISSOLVE';
      title: string;
      description: string;
      deadline: string;
      meetingId?: string;
    } = {
      type: form.type as 'EXPENSE' | 'KICK' | 'DISSOLVE',
      title: form.title,
      description: form.description,
      deadline: new Date(form.deadline).toISOString(),
    };

    if (form.type === 'EXPENSE') {
      payload.meetingId = form.meetingId;
    }

    createVote(payload, {
      onSuccess: () => {
        navigate(CHALLENGE_ROUTES.votes(challengeRef || challengeId));
      }
    });
  };

  const getMinDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Min 24h
    return d.toISOString().slice(0, 16);
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
              const nextType = e.target.value as VoteType;
              setMeetingError('');
              setForm({
                ...form,
                type: nextType,
                meetingId: nextType === 'EXPENSE' ? form.meetingId : '',
              });
            }}
            className={styles.select}
          >
            <option value="EXPENSE">지출 승인</option>
            <option value="KICK">멤버 강퇴</option>
            <option value="DISSOLVE">챌린지 해산</option>
          </select>
        </div>

        {form.type === 'EXPENSE' && (
          <div className={styles.field}>
            <label>모임 선택 (해당 모임 참석자만 투표 가능)</label>
            <select
              value={form.meetingId}
              onChange={(e) => {
                setMeetingError('');
                setForm({ ...form, meetingId: e.target.value });
              }}
              className={styles.select}
              required
              disabled={isMeetingsLoading || selectableMeetings.length === 0}
            >
              {isMeetingsLoading && (
                <option value="">모임 목록 불러오는 중...</option>
              )}
              {!isMeetingsLoading && (
                <option value="" disabled>
                  {selectableMeetings.length > 0 ? '모임을 선택하세요' : '참석 확정된 모임이 없습니다'}
                </option>
              )}
              {!isMeetingsLoading && selectableMeetings.map((meeting) => (
                <option key={meeting.meetingId} value={meeting.meetingId}>
                  {`${meeting.title} (${new Date(meeting.meetingDate).toLocaleDateString('ko-KR')})`}
                </option>
              ))}
            </select>
            {meetingError ? (
              <p className={styles.errorMessage}>{meetingError}</p>
            ) : (
              <p className={styles.hint}>선택한 모임에 참석 의사(AGREE)를 표시한 멤버만 투표할 수 있습니다.</p>
            )}
          </div>
        )}

        <div className={styles.field}>
          <label>제목</label>
          <Input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="투표 제목을 입력하세요"
            required
          />
        </div>

        <div className={styles.field}>
          <label>설명</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="상세 내용을 입력하세요"
            className={styles.textarea}
            rows={5}
          />
        </div>

        <div className={styles.field}>
          <label>마감 일시 (최소 24시간 후)</label>
          <input
            type="datetime-local"
            value={form.deadline}
            min={getMinDateTime()}
            onChange={e => setForm({ ...form, deadline: e.target.value })}
            className={styles.dateInput}
            required
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={isPending || (form.type === 'EXPENSE' && selectableMeetings.length === 0)}>
            {isPending ? '생성 중...' : '투표 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}
