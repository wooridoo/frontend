import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText, Settings, Wallet, Info } from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import styles from './CreateChallengePage.module.css';

// Zod Schema (API 기준)
const challengeSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요'),
  name: z.string().min(5, '제목은 5자 이상이어야 합니다').max(30, '제목은 30자 이내여야 합니다'),
  description: z.string().min(20, '소개글은 20자 이상 입력해주세요'),
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  maxMembers: z.number().min(3, '최소 3명 이상이어야 합니다').max(30, '최대 30명까지 가능합니다'),
  supportAmount: z.number().min(10000, '최소 10,000원 이상이어야 합니다'),
  depositAmount: z.number().min(0), // Auto-calculated
  rules: z.string().optional(),
});

type ChallengeFormValues = z.infer<typeof challengeSchema>;

const CATEGORIES = [
  { id: 'LIFE', label: '생활습관', icon: '☀️' },
  { id: 'EXERCISE', label: '운동', icon: '💪' },
  { id: 'STUDY', label: '공부', icon: '📚' },
  { id: 'HOBBY', label: '취미', icon: '🎨' },
  { id: 'ASSET', label: '재테크', icon: '💰' },
  { id: 'ETC', label: '기타', icon: '🎸' },
];

export function CreateChallengePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      maxMembers: 10,
      supportAmount: 10000,
      depositAmount: 10000,
    },
  });

  const selectedCategory = watch('category');
  const supportAmount = watch('supportAmount');

  // Auto-sync deposit with support amount (1개월치 고정)
  useEffect(() => {
    if (supportAmount) {
      setValue('depositAmount', supportAmount);
    }
  }, [supportAmount, setValue]);

  const onSubmit = async (data: ChallengeFormValues) => {
    try {
      // API Payload (supportDay는 1로 고정)
      const payload = {
        ...data,
        supportDay: 1, // 매월 1일 고정
      };
      console.log('Create Challenge Payload:', payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('챌린지가 개설되었습니다!');
      navigate(PATHS.HOME);
    } catch (error) {
      console.error(error);
      alert('챌린지 개설 중 오류가 발생했습니다.');
    }
  };



  return (
    <PageContainer>
      <PageHeader title="챌린지 개설" showBack />

      <form id="create-challenge-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          {/* 1. 카테고리 */}
          <section className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>카테고리 선택</h2>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`${styles.categoryCard} ${selectedCategory === cat.id ? styles.selected : ''}`}
                  onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  <span className={styles.categoryName}>{cat.label}</span>
                </div>
              ))}
            </div>
            {errors.category && <p className={styles.error}>{errors.category.message}</p>}
          </section>

          {/* 2. 기본 정보 */}
          <Card variant="accent" size="md" className={styles.section}>
            <CardHeader title="기본 정보" icon={<FileText size={20} />} />
            <CardBody className={styles.cardBody}>
              <div className={styles.formGroup}>
                <Input
                  label="챌린지 제목"
                  placeholder="예) 매일 아침 6시 기상하기"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>대표 이미지</label>
                <div className={styles.uploadArea}>
                  <Upload className={styles.uploadIcon} />
                  <span>이미지 업로드</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>소개글</label>
                <textarea
                  className={styles.textarea}
                  placeholder="챌린지 목표와 인증 방법을 상세히 적어주세요."
                  {...register('description')}
                />
                {errors.description && <p className={styles.error}>{errors.description.message}</p>}
              </div>
            </CardBody>
          </Card>

          {/* 3. 운영 설정 */}
          <Card variant="accent" size="md" className={styles.section}>
            <CardHeader title="운영 설정" icon={<Settings size={20} />} />
            <CardBody className={styles.cardBody}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <Input
                    label="시작일"
                    type="date"
                    error={errors.startDate?.message}
                    {...register('startDate')}
                  />
                </div>
                <div className={styles.col}>
                  <Input
                    label="최대 모집 인원"
                    type="number"
                    error={errors.maxMembers?.message}
                    {...register('maxMembers', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className={styles.infoBox}>
                <Info size={16} />
                <span>서포트 금액은 매월 1일에 자동 출금됩니다.</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>챌린지 규칙 (선택)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="인증 빈도, 기간 등 원하는 규칙을 자유롭게 적어주세요.&#10;예) 매일 인증 / 4주간 진행 / 사진 필수"
                  {...register('rules')}
                />
              </div>
            </CardBody>
          </Card>

          {/* 4. 금액 설정 */}
          <Card variant="accent" size="md" className={styles.section}>
            <CardHeader title="금액 설정" icon={<Wallet size={20} />} />
            <CardBody className={styles.cardBody}>
              <Input
                label="월 서포트 금액"
                type="number"
                placeholder="10000"
                hint="최소 10,000원 이상, 10,000원 단위"
                error={errors.supportAmount?.message}
                {...register('supportAmount', { valueAsNumber: true })}
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>참가 보증금</label>
                <input
                  className={`${styles.input} ${styles.readOnlyInput}`}
                  type="text"
                  value={supportAmount ? `${supportAmount.toLocaleString()}원` : '0원'}
                  readOnly
                />
                <span className={styles.hint}>월 서포트 금액과 동일하게 자동 설정됩니다.</span>
              </div>
            </CardBody>
          </Card>

          <div className={styles.bottomAction}>
            <Button
              className={styles.submitButton}
              size="lg"
              type="submit"
              isLoading={isSubmitting}
            >
              챌린지 개설하기
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
