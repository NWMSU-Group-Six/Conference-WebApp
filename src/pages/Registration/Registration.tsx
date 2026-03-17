import styles from "./Registration.module.css";

const registrationData = [
  { type: "Regular", early: "$165", late: "$190" },
  { type: "Retired Faculty", early: "$75", late: "$75" },
  { type: "K-12 Faculty", early: "$70", late: "$70" },
  { type: "Student – Full Conference", early: "$70", late: "$70" },
  { type: "Student – Saturday Only", early: "$30", late: "$30" },
  { type: "Vendor", early: "$135", late: "$135" },
];

export default function Registration() {
  return (
    <div className={styles.registrationPage}>
      <div className={styles.registrationContainer}>

        <h1 className={styles.registrationTitle}>Registration</h1>
        <hr className={styles.registrationDivider} />
        <p className={styles.registrationSubtitle}>
          Register to attend the Conference at Northwest Missouri State University
        </p>

        <div className={styles.registrationCard}>
          <h2 className={styles.sectionTitle}>Registration Costs</h2>
          <p className={styles.deadline}>
            Early Registration Deadline is <strong>April 27, 2026</strong>
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Registration Type</th>
                  <th>Early Registration</th>
                  <th>Late / Onsite Registration</th>
                </tr>
              </thead>
              <tbody>
                {registrationData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.type}</td>
                    <td>{row.early}</td>
                    <td>{row.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}