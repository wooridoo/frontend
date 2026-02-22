import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { PATHS } from '@/routes/paths';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 전역 렌더링 오류를 포착하고 복구 액션을 제공하는 에러 바운더리입니다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('예상치 못한 렌더링 오류:', error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.iconWrap}>
            <AlertTriangle size={24} />
          </div>

          <h2 className={styles.title}>문제가 발생했습니다</h2>
          <p className={styles.description}>
            일시적인 오류일 수 있습니다. 새로고침하거나 잠시 후 다시 시도해 주세요.
          </p>

          {import.meta.env.DEV && this.state.error ? (
            <div className={styles.errorBox}>{this.state.error.toString()}</div>
          ) : null}

          <div className={styles.actionGroup}>
            <Button onClick={() => window.location.reload()}>페이지 새로고침</Button>
            <Button variant="ghost" onClick={() => window.location.assign(PATHS.HOME)}>
              홈으로 이동
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
