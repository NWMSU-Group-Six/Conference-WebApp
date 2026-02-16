import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section - Conference Info */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.conferenceTitle}>Northwest Conference 2026</h1>
          <p className={styles.conferenceSubtitle}>
            Join us for an exciting conference bringing together researchers, 
            academics, and industry professionals
          </p>
          <button className={styles.registerButton}>Register Now</button>
        </div>
      </section>

      {/* Paper Submission Section */}
      <section className={styles.paperSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Submit Your Paper</h2>
          <p className={styles.sectionDescription}>
            We invite researchers and academics to submit their papers for review. 
            Share your innovative ideas and contribute to the advancement of knowledge 
            in your field.
          </p>
          <button className={styles.submitButton}>Submit Paper</button>
        </div>
      </section>

      {/* General Information Section */}
      <section className={styles.infoSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>General Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>Conference Dates</h3>
              <p>To be announced</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Location</h3>
              <p>To be announced</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Submission Deadline</h3>
              <p>To be announced</p>
            </div>
            <div className={styles.infoCard}>
              <h3>Contact</h3>
              <p>info@northwestconference.edu</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
