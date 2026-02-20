import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="text-center space-y-4 max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              앗! 문제가 발생했어요
            </h2>

            <p className="text-gray-500 text-sm break-keep">
              일시적인 오류일 수 있습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>

            {/* Dev Mode - Show partial error details */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-left overflow-auto max-h-32 text-xs text-red-500 font-mono">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                페이지 새로고침
              </Button>
            </div>

            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={() => window.location.assign('/')}
                className="w-full text-gray-400 hover:text-gray-600"
              >
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
