import styles from './EventSlide.module.css';

export function EventSlide() {
  return (
    <article className={styles.slideContent}>
      <div className={styles.textArea}>
        <h2 className={styles.slideTitle}>신규 가입 이벤트<br />당도 10g 지급!</h2>
        <p className={styles.slideDesc}>지금 시작하고 혜택을 받아보세요.</p>
      </div>
    </article>
  );
}
