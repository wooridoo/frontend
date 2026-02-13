import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useCreateChallengeModalStore } from '@/store/modal/useModalStore';
import { Category } from '@/types/enums';
import { client } from '@/lib/api/client';
import { PATHS } from '@/routes/paths';
import styles from './CreateChallengeModal.module.css';

// Category labels for UI
const CATEGORY_OPTIONS = [
    { value: Category.HOBBY, label: '취미' },
    { value: Category.STUDY, label: '학습' },
    { value: Category.EXERCISE, label: '운동' },
    { value: Category.SAVINGS, label: '저축' },
    { value: Category.TRAVEL, label: '여행' },
    { value: Category.FOOD, label: '음식' },
    { value: Category.CULTURE, label: '문화' },
    { value: Category.OTHER, label: '기타' },
];

interface CreateChallengeFormData {
    name: string;
    description: string;
    category: string;
    maxMembers: number;
    supportAmount: number;
    depositAmount: number;
    startDate: string;
    thumbnailImage?: string;
    rules?: string;
}

const initialFormData: CreateChallengeFormData = {
    name: '',
    description: '',
    category: Category.OTHER,
    maxMembers: 10,
    supportAmount: 10000,
    depositAmount: 10000,
    startDate: '',
    thumbnailImage: '',
    rules: '',
};

export function CreateChallengeModal() {
    const { isOpen, onClose } = useCreateChallengeModalStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
    const [formData, setFormData] = useState<CreateChallengeFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof CreateChallengeFormData, string>>>({});

    const createChallengeMutation = useMutation({
        mutationFn: async (data: CreateChallengeFormData) => {
            return client.post<{ challengeId: string }>('/challenges', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            setStep('success');
        },
    });

    const handleClose = () => {
        setStep('form');
        setFormData(initialFormData);
        setErrors({});
        onClose();
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CreateChallengeFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = '챌린지 이름을 입력해주세요';
        } else if (formData.name.length < 2 || formData.name.length > 50) {
            newErrors.name = '2~50자로 입력해주세요';
        }

        if (!formData.description.trim()) {
            newErrors.description = '챌린지 설명을 입력해주세요';
        } else if (formData.description.length > 500) {
            newErrors.description = '500자 이내로 입력해주세요';
        }

        if (!formData.category) {
            newErrors.category = '카테고리를 선택해주세요';
        }

        if (formData.maxMembers < 3 || formData.maxMembers > 30) {
            newErrors.maxMembers = '3~30명 사이로 입력해주세요';
        }

        if (formData.supportAmount < 10000) {
            newErrors.supportAmount = '최소 10,000원 이상이어야 합니다';
        }

        if (!formData.startDate) {
            newErrors.startDate = '시작일을 선택해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep('confirm');
        }
    };

    const handleSubmit = () => {
        createChallengeMutation.mutate(formData);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['maxMembers', 'supportAmount', 'depositAmount'].includes(name)
                ? Number(value)
                : value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof CreateChallengeFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSuccessClose = () => {
        handleClose();
        navigate(PATHS.MY.CHALLENGES);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>새 챌린지 만들기</h2>

                {/* Step Indicator */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${step === 'form' ? styles.active : ''}`} />
                    <div className={`${styles.step} ${step === 'confirm' ? styles.active : ''}`} />
                    <div className={`${styles.step} ${step === 'success' ? styles.active : ''}`} />
                </div>

                {step === 'form' && (
                    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                챌린지 이름 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="예: 매일 1만보 걷기"
                                className={styles.input}
                                maxLength={50}
                            />
                            {errors.name && <span className={styles.error}>{errors.name}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                설명 <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="챌린지에 대해 간단히 소개해주세요"
                                className={styles.textarea}
                                maxLength={500}
                            />
                            {errors.description && <span className={styles.error}>{errors.description}</span>}
                            <span className={styles.hint}>{formData.description.length}/500</span>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>
                                    카테고리 <span className={styles.required}>*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>
                                    최대 인원 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="number"
                                    name="maxMembers"
                                    value={formData.maxMembers}
                                    onChange={handleInputChange}
                                    min={3}
                                    max={30}
                                    className={styles.input}
                                />
                                {errors.maxMembers && <span className={styles.error}>{errors.maxMembers}</span>}
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>
                                    월 서포트 금액 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="number"
                                    name="supportAmount"
                                    value={formData.supportAmount}
                                    onChange={handleInputChange}
                                    min={10000}
                                    step={1000}
                                    className={styles.input}
                                />
                                {errors.supportAmount && <span className={styles.error}>{errors.supportAmount}</span>}
                                <span className={styles.hint}>최소 10,000원</span>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>보증금</label>
                                <input
                                    type="number"
                                    name="depositAmount"
                                    value={formData.depositAmount}
                                    onChange={handleInputChange}
                                    min={0}
                                    step={1000}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                시작일 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className={styles.input}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.startDate && <span className={styles.error}>{errors.startDate}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>규칙 (선택)</label>
                            <textarea
                                name="rules"
                                value={formData.rules}
                                onChange={handleInputChange}
                                placeholder="챌린지 규칙을 입력해주세요"
                                className={styles.textarea}
                                maxLength={1000}
                            />
                        </div>

                        <div className={styles.actions}>
                            <Button type="button" onClick={handleClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button type="submit" className={styles.submitButton}>
                                다음
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'confirm' && (
                    <div className={styles.form}>
                        <p>다음 내용으로 챌린지를 생성합니다:</p>
                        <ul>
                            <li><strong>이름:</strong> {formData.name}</li>
                            <li><strong>카테고리:</strong> {CATEGORY_OPTIONS.find(c => c.value === formData.category)?.label}</li>
                            <li><strong>최대 인원:</strong> {formData.maxMembers}명</li>
                            <li><strong>월 서포트:</strong> {formData.supportAmount.toLocaleString()}원</li>
                            <li><strong>보증금:</strong> {formData.depositAmount.toLocaleString()}원</li>
                            <li><strong>시작일:</strong> {formData.startDate}</li>
                        </ul>
                        <div className={styles.actions}>
                            <Button type="button" onClick={() => setStep('form')} className={styles.cancelButton}>
                                수정하기
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className={styles.submitButton}
                                disabled={createChallengeMutation.isPending}
                            >
                                {createChallengeMutation.isPending ? '생성 중...' : '챌린지 생성'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>🎉</div>
                        <p className={styles.successMessage}>
                            챌린지가 생성되었습니다!<br />
                            멤버를 모집해보세요.
                        </p>
                        <Button onClick={handleSuccessClose} className={styles.submitButton}>
                            확인
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
