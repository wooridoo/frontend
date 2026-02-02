import styles from './FeedPage.module.css';
import { PostEditor } from './PostEditor';
import { PostCard } from './PostCard';

const MOCK_POSTS: Array<React.ComponentProps<typeof PostCard>> = [
  {
    id: 1,
    author: { name: '김철수', avatar: 'https://i.pravatar.cc/150?u=1', role: 'leader' },
    content: '📢 2월 정기모임 장소가 변경되었습니다!\n강남역 → 선릉역 스터디카페로 변경됩니다. 참석 여부 투표 부탁드려요~',
    createdAt: '1시간 전',
    likes: 8,
    comments: 3,
    isNotice: true,
  },
  {
    id: 2,
    author: { name: '이영희', avatar: 'https://i.pravatar.cc/150?u=2' },
    content: '이번 주 독서 인증합니다! 📚\n"클린 코드" 완독했어요. 다음 달 모임에서 후기 나눠요~',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    createdAt: '2시간 전',
    likes: 12,
    comments: 5,
  },
  {
    id: 3,
    author: { name: '박민수', avatar: 'https://i.pravatar.cc/150?u=3' },
    content: '다음 달에 읽을 책 추천받습니다!\n개발 관련 책이면 좋을 것 같아요. 어떤 책이 좋을까요?',
    createdAt: '5시간 전',
    likes: 6,
    comments: 14,
  }
];

export function FeedPage() {
  return (
    <div className={styles.feedContainer}>
      <PostEditor />
      <div className={styles.feedList}>
        {MOCK_POSTS.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
