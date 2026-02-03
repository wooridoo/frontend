import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">
        로딩 중입니다...
      </p>
    </div>
  );
}
