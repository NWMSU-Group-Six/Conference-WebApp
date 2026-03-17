import { useState } from "react";
import styles from "./Signup.module.css";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // TODO: Replace with Firebase createUserWithEmailAndPassword
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/convert.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>

      <div className={`${styles.signupCard} relative z-10`}>

        <h1 className={styles.signupTitle}>Conference Sign Up</h1>
        <hr className={styles.signupDivider} />

        {submitted && (
          <div className={styles.successBanner}>
            Registration successful! Check your email for confirmation.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.signupForm}>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jane"
                value={formData.firstName}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.firstName ? styles.inputError : ""}`}
              />
              {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.lastName ? styles.inputError : ""}`}
              />
              {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
            />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ""}`}
            />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading} className={styles.btnSignup}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <button
            type="button"
            className={styles.btnSignin}
            onClick={() => (window.location.href = "/login")}
          >
            Already have an account? Sign in
          </button>

        </form>
      </div>
    </div>
  );
}