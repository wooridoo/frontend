import { useState } from 'react';
import { Modal } from '@/components/ui/Overlay/Modal';
import { Button } from '@/components/ui';
import { useSupportSettingsModalStore } from '@/store/modal/useModalStore';
import { formatCurrency } from '@/lib/utils';
import styles from './CreateChallengeModal.module.css';

interface SupportSettings {
    supportAmount: number;
    autoSupportEnabled: boolean;
    autoSupportPercentage: number;
}

const PRESET_AMOUNTS = [10000, 20000, 30000, 50000, 100000];

export function SupportSettingsModal() {
    const { isOpen, onClose } = useSupportSettingsModalStore();
    const [settings, setSettings] = useState<SupportSettings>({
        supportAmount: 30000,
        autoSupportEnabled: false,
        autoSupportPercentage: 10,
    });
    const [saved, setSaved] = useState(false);

    const handleClose = () => {
        setSaved(false);
        onClose();
    };

    const handleSave = () => {
        // API call would go here
        setSaved(true);
        setTimeout(handleClose, 1500);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className={styles.modalContent}>
            <div className={styles.container}>
                <h2 className={styles.title}>서포트 설정</h2>

                {saved ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>✅</div>
                        <p>설정이 저장되었습니다!</p>
                    </div>
                ) : (
                    <div className={styles.form}>
                        {/* Support Amount */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>월 서포트 금액</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                {PRESET_AMOUNTS.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setSettings(prev => ({ ...prev, supportAmount: amount }))}
                                        style={{
                                            padding: 'var(--spacing-sm)',
                                            border: settings.supportAmount === amount ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            background: settings.supportAmount === amount ? 'rgba(var(--color-primary-rgb), 0.1)' : 'var(--color-surface)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {(amount / 10000).toLocaleString()}만원
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                className={styles.input}
                                value={settings.supportAmount}
                                onChange={(e) => setSettings(prev => ({ ...prev, supportAmount: Number(e.target.value) }))}
                                min={10000}
                                step={1000}
                            />
                        </div>

                        {/* Auto Support */}
                        <div className={styles.fieldGroup}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.autoSupportEnabled}
                                    onChange={(e) => setSettings(prev => ({ ...prev, autoSupportEnabled: e.target.checked }))}
                                />
                                <span className={styles.label}>서포트 자동 증가</span>
                            </label>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', margin: 'var(--spacing-xs) 0' }}>
                                챌린지 완료 시 서포트 금액을 자동으로 증가시킵니다
                            </p>
                        </div>

                        {settings.autoSupportEnabled && (
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>증가율 (%)</label>
                                <select
                                    className={styles.select}
                                    value={settings.autoSupportPercentage}
                                    onChange={(e) => setSettings(prev => ({ ...prev, autoSupportPercentage: Number(e.target.value) }))}
                                >
                                    {[5, 10, 15, 20, 25, 30].map((p) => (
                                        <option key={p} value={p}>{p}%</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Summary */}
                        <div style={{ background: 'var(--color-surface-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                현재 설정: 월 <strong>{formatCurrency(settings.supportAmount)}</strong>
                                {settings.autoSupportEnabled && ` (완료 시 ${settings.autoSupportPercentage}% 증가)`}
                            </p>
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleClose} className={styles.cancelButton}>
                                취소
                            </Button>
                            <Button onClick={handleSave} className={styles.submitButton}>
                                저장
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
