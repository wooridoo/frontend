import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import logo from '@/assets/woorido_logo.svg';
import { Modal } from '@/components/ui/Overlay/Modal';
import { useSignupModalStore } from '@/store/useSignupModalStore';
import { useLoginModalStore } from '@/store/useLoginModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './SignupModal.module.css';

// Signup form validation schema
const signupSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요')
        .email('올바른 이메일 형식이 아닙니다'),
    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다')
        .regex(/[a-zA-Z]/, '영문이 포함되어야 합니다')
        .regex(/[0-9]/, '숫자가 포함되어야 합니다'),
    confirmPassword: z
        .string()
        .min(1, '비밀번호 확인을 입력해주세요'),
    nickname: z
        .string()
        .min(2, '닉네임은 2자 이상이어야 합니다')
        .max(10, '닉네임은 10자 이내여야 합니다'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupModal() {
    const { isOpen, onClose } = useSignupModalStore();
    const { onOpen: openLogin } = useLoginModalStore();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const handleLoginLink = () => {
        onClose();
        openLogin();
    };

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            console.log('Signup attempt:', data);

            // Auto login after signup
            login({
                userId: Date.now(),
                email: data.email,
                name: data.nickname, // Temporary mapping
                nickname: data.nickname,
                profileImage: `https://ui-avatars.com/api/?name=${data.nickname}&background=random`,
                status: 'ACTIVE' as any,
                brix: 50,
                account: {
                    accountId: 999,
                    balance: 0,
                    availableBalance: 0,
                    lockedBalance: 0
                },
                stats: {
                    challengeCount: 0,
                    completedChallenges: 0,
                    totalSupportAmount: 0
                }
            });

            onClose();
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className={styles.modalContent}>
            <div className={styles.container}>
                {/* Logo & Branding */}
                <header className={styles.header}>
                    <div className={styles.logo}>
                        <img src={logo} alt="우리두 로고" className={styles.logoImage} />
                    </div>
                    <h2 className={styles.title}>회원가입</h2>
                    <p className={styles.subtitle}>우리두와 함께 도전하는 즐거움을 느껴보세요.</p>
                </header>

                {/* Signup Form */}
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="이메일"
                        type="email"
                        placeholder="email@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="닉네임"
                        placeholder="2~10자 이내 (한글, 영문, 숫자)"
                        error={errors.nickname?.message}
                        {...register('nickname')}
                    />

                    <Input
                        label="비밀번호"
                        type="password"
                        placeholder="8자 이상 (영문, 숫자 포함)"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Input
                        label="비밀번호 확인"
                        type="password"
                        placeholder="비밀번호 재입력"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <div style={{ flex: 1 }} />

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className={styles.submitButton}
                        variant="primary"
                        size="lg"
                    >
                        가입하기
                    </Button>
                </form>

                {/* Footer Links */}
                <footer className={styles.footer}>
                    <p className={styles.loginPrompt}>
                        이미 계정이 있으신가요?{' '}
                        <button type="button" onClick={handleLoginLink} className={styles.loginLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>
                            로그인
                        </button>
                    </p>
                </footer>
            </div>
        </Modal>
    );
}
