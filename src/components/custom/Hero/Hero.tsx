import styles from "./Hero.module.css";

export default function Hero({
  title,
  subtitle,
  date,
}: {
  title: string;
  subtitle: string;
  date?: string;
}) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.cfpContainer}>
        <h1 className={styles.mainHeading}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.dates}>{date}</p>
      </div>
    </section>
  );
}
