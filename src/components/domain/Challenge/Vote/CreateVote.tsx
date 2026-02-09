import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateVote } from '../../../../hooks/useVote';
import { Button, Input } from '../../../../components/common';
import type { VoteType } from '../../../../types/domain';
import styles from './CreateVote.module.css';

export function CreateVote() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: createVote, isPending } = useCreateVote(id!);

  const [form, setForm] = useState<{
    type: VoteType;
    title: string;
    description: string;
    deadline: string;
  }>({
    type: 'EXPENSE',
    title: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.deadline) return;

    // TODO: Validate deadline is > 24h from now (logic in implementation plan)

    createVote({
      type: form.type as 'EXPENSE' | 'KICK' | 'DISSOLVE',
      title: form.title,
      description: form.description,
      deadline: new Date(form.deadline).toISOString(),
    }, {
      onSuccess: () => {
        navigate(`/challenges/${id}/votes`);
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
            onChange={e => setForm({ ...form, type: e.target.value as VoteType })}
            className={styles.select}
          >
            <option value="EXPENSE">지출 승인</option>
            <option value="KICK">멤버 강퇴</option>
            <option value="DISSOLVE">챌린지 해산</option>
          </select>
        </div>

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
          <Button type="submit" disabled={isPending}>
            {isPending ? '생성 중...' : '투표 생성'}
          </Button>
        </div>
      </form>
    </div>
  );
}
