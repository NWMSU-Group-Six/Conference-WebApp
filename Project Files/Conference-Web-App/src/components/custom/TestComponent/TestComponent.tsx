import styles from "./Button.module.css";

function Button() {
  // 'styles.btn' will resolve to the unique hashed class name
  return <button className={styles.btn}>Click Me</button>;
}

export default Button;
