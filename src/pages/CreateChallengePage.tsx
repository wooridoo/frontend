import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText, Settings, Wallet, Info } from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer/PageContainer';
import { Button, Input, Card, CardHeader, CardBody, SemanticIcon } from '@/components/ui';
import { useCreateChallenge } from '@/hooks/useChallenge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CATEGORY_VISUALS } from '@/lib/constants/categoryVisuals';
import { PATHS } from '@/routes/paths';
import { CHALLENGE_ROUTES } from '@/routes/challengePaths';
import { Category } from '@/types/enums';
import { toast } from 'sonner';
import { preloadLottie } from '@/components/ui/Icon/lottieRegistry';
import styles from './CreateChallengePage.module.css';

// 보조 처리
const challengeSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요'),
  name: z.string().min(5, '제목은 5자 이상이어야 합니다').max(30, '제목은 30자 이내여야 합니다'),
  description: z.string().min(20, '소개글은 20자 이상 입력해주세요'),
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  maxMembers: z.number().min(3, '최소 3명 이상이어야 합니다').max(30, '최대 30명까지 가능합니다'),
  supportAmount: z.number().min(10000, '최소 10,000원 이상이어야 합니다'),
  depositAmount: z.number().min(0), // ?? ??
  rules: z.string().optional(),
});

type ChallengeFormValues = z.infer<typeof challengeSchema>;

const CREATE_CATEGORY_ORDER: Category[] = [
  Category.CULTURE,
  Category.EXERCISE,
  Category.STUDY,
  Category.HOBBY,
  Category.SAVINGS,
  Category.OTHER,
];

const CATEGORIES = CREATE_CATEGORY_ORDER.map(category => ({
  id: category,
  ...CATEGORY_VISUALS[category],
}));

/**
 * 챌린지 생성 페이지입니다.
 * 카테고리/기본정보/운영설정/금액설정을 한 폼으로 수집합니다.
 */
export function CreateChallengePage() {
  const navigate = useNavigate();
  const createChallengeMutation = useCreateChallenge();
  const isMobileLayout = useMediaQuery('(max-width: 768px)');
  const categoryIconSize = isMobileLayout ? 26 : 30;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      maxMembers: 10,
      supportAmount: 10000,
      depositAmount: 10000,
    },
  });

  const selectedCategory = useWatch({ control, name: 'category' });
  const supportAmount = useWatch({ control, name: 'supportAmount' });

  // 보조 처리
  useEffect(() => {
    if (supportAmount) {
      setValue('depositAmount', supportAmount);
    }
  }, [supportAmount, setValue]);

  useEffect(() => {
    const preloadTargets = [...new Set(CATEGORIES.map(category => category.iconName))];
    preloadTargets.forEach(iconName => {
      void preloadLottie(iconName);
    });
  }, []);

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const onSubmit = async (data: ChallengeFormValues) => {
    setFormErrors([]);
    try {
      const result = await createChallengeMutation.mutateAsync({
        ...data,
        supportDay: 1, // ?? ??
      });
      toast.success('챌린지가 개설되었습니다!');
      const newId = result.challengeId;
      navigate(newId ? CHALLENGE_ROUTES.detailWithTitle(newId, data.name) : PATHS.HOME);
    } catch (err: unknown) {
      let message = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : '챌린지 개설 중 오류가 발생했습니다.';
      // 보조 처리
      message = message.replace(/^[A-Z_]+_?\d*:\s*/i, '');
      setFormErrors([`❌ ${message}`]);
    }
  };

  // 유효성 검사 실패 시 구체적 에러 메시지 표시
  const onFormError = () => {
    const msgs: string[] = [];
    if (errors.category) msgs.push('❌ 카테고리를 선택해주세요');
    if (errors.name) msgs.push(`❌ ${errors.name.message || '제목을 확인해주세요'}`);
    if (errors.description) msgs.push(`❌ ${errors.description.message || '소개글을 확인해주세요'}`);
    if (errors.startDate) msgs.push('❌ 시작일을 선택해주세요');
    if (errors.maxMembers) msgs.push(`❌ ${errors.maxMembers.message || '모집 인원을 확인해주세요'}`);
    if (errors.supportAmount) msgs.push(`❌ ${errors.supportAmount.message || '서포트 금액을 확인해주세요'}`);
    setFormErrors(msgs.length > 0 ? msgs : ['❌ 입력 정보를 확인해주세요']);
  };

  return (
    <PageContainer variant="content" contentWidth="lg">
      <PageHeader title="챌린지 개설" showBack />

      <form id="create-challenge-form" onSubmit={handleSubmit(onSubmit, onFormError)}>
        <div className={styles.container}>
          {/* 1. 카테고리 */}
          <section className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>카테고리 선택</h2>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  aria-pressed={selectedCategory === cat.id}
                  className={`${styles.categoryCard} ${selectedCategory === cat.id ? styles.selected : ''}`}
                  onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                  type="button"
                >
                  <span className={styles.categoryIcon}>
                    <SemanticIcon
                      animated
                      fallbackName={cat.iconName}
                      playMode="loop"
                      name={cat.iconName}
                      size={categoryIconSize}
                    />
                  </span>
                  <span className={styles.categoryName}>{cat.label}</span>
                </button>
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
                    onKeyDown={(e: React.KeyboardEvent) => e.preventDefault()}
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

          {formErrors.length > 0 && (
            <div className={styles.errorSummary}>
              <p className={styles.errorSummaryTitle}>아래 항목을 확인해주세요</p>
              <ul className={styles.errorList}>
                {formErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.bottomAction}>
            <Button
              className={styles.submitButton}
              size="lg"
              type="submit"
              isLoading={createChallengeMutation.isPending}
            >
              챌린지 개설하기
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
