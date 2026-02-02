import { Link } from 'react-router-dom';
import styles from './ActiveChallengeBlock.module.css';

export function ActiveChallengeBlock() {
  return (
    <div className={styles.container}>
      <Link to="/challenges/active-1" className={styles.link}>
        <img
          src="https://picsum.photos/seed/running/600/400"
          alt="Running"
          className={styles.image}
        />
        <div className={styles.overlay}>
          <div className={styles.content}>
            <span className={styles.tag}>진행 중</span>
            <h3 className={styles.title}>매일 아침<br />러닝 5km</h3>
            <p className={styles.progress}>14일차 / 30일</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
