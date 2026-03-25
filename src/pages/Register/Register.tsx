import { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { getDataByCollection } from "@/firebase/db";
import type { Registration } from "@/models/Registration";

export default function Registration() {
  const [registration, setRegistration] = useState<Registration[]>([]);

  useEffect(() => {
    const fetchRegistration = async () => {
      const data = await getDataByCollection<Registration>("registration");
      setRegistration(data);
    };
    fetchRegistration();
  }, []);

  return (
    <div className={styles.registrationPage}>
      <div className={styles.registrationContainer}>
        <h1 className={styles.registrationTitle}>Registration</h1>
        <hr className={styles.registrationDivider} />
        <p className={styles.registrationSubtitle}>
          Register to attend the Conference at Northwest Missouri State
          University
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
                {registration.map((row, index) => (
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
