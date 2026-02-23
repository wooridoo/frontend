import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PostEditor.module.css';
import { Image, Send, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreatePost } from '@/hooks/useFeed';
import { useChallengeRoute } from '@/hooks/useChallengeRoute';
import { useChallengeDetail } from '@/hooks/useChallenge';
import { Button } from '@/components/ui';
import { uploadPostImages } from '@/lib/api/upload';
import { validateImageFiles } from '@/lib/image/validation';
import { toast } from 'sonner';

interface PostEditorProps {
  onSuccess?: () => void;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function PostEditor({ onSuccess }: PostEditorProps) {
  const { challengeId } = useChallengeRoute();
  const { data: challenge } = useChallengeDetail(challengeId);
  const { user } = useAuthStore();
  const avatarUrl = user?.profileImage || '/images/avatar-fallback.svg';
  const isLeader = challenge?.myMembership?.role === 'LEADER';

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'NOTICE'>('GENERAL');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createPost = useCreatePost(challengeId || '');
  const previewUrls = useMemo(() => selectedImages.map(file => URL.createObjectURL(file)), [selectedImages]);

  useEffect(() => () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const handleSubmit = async () => {
    if (!content.trim() || !challengeId) return;

    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadPostImages(challengeId, selectedImages);
      }

      await createPost.mutateAsync({
        title: content.slice(0, 20),
        content: content.trim(),
        category,
        imageUrls,
      });
      setContent('');
      setCategory('GENERAL');
      setSelectedImages([]);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error(error instanceof Error ? error.message : '게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const mergedFiles = [...selectedImages, ...files];
    try {
      await validateImageFiles('POST_ATTACHMENT', mergedFiles);
      setSelectedImages(mergedFiles);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 업로드 정책을 확인해 주세요.');
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      {isLeader ? (
        <div className={styles.categoryRow}>
          <label htmlFor="post-category" className={styles.categoryLabel}>게시글 유형</label>
          <select
            id="post-category"
            className={styles.categorySelect}
            value={category}
            onChange={(e) => setCategory(e.target.value as 'GENERAL' | 'NOTICE')}
            disabled={isSubmitting}
          >
            <option value="GENERAL">일반</option>
            <option value="NOTICE">공지</option>
          </select>
        </div>
      ) : null}

      <div className={styles.inputRow}>
        <img src={avatarUrl} alt="내 프로필" className={styles.avatar} />
        <div className={styles.inputWrapper}>
          <textarea
            placeholder="새로운 소식을 공유해보세요..."
            className={styles.textarea}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            disabled={isSubmitting}
          />

          {previewUrls.length > 0 ? (
            <div className={styles.previewGrid}>
              {previewUrls.map((previewUrl, index) => (
                <div key={`${previewUrl}-${index}`} className={styles.previewItem}>
                  <img
                    alt={`업로드 이미지 ${index + 1}`}
                    className={styles.previewImage}
                    src={previewUrl}
                  />
                  <button
                    type="button"
                    className={styles.removePreviewButton}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.actions}>
        <input
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className={styles.hiddenFileInput}
          multiple
          onChange={handleFileChange}
          type="file"
        />
        <Button
          className={styles.actionButton}
          onClick={handleOpenFileDialog}
          disabled={isSubmitting}
          leadingIcon={<Image size={20} />}
          size="sm"
          variant="text"
        >
          사진 ({selectedImages.length}/10)
        </Button>
        <Button
          className={styles.postButton}
          shape="pill"
          size="sm"
          trailingIcon={<Send size={14} className={styles.sendIcon} />}
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          variant="primary"
        >
          {isSubmitting ? '게시 중...' : '게시'}
        </Button>
      </div>
    </div>
  );
}
