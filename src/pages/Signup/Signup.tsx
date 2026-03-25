import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/firebase/auth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface FormErrors {
  firstName?: string; lastName?: string; email?: string;
  password?: string; confirmPassword?: string; general?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.firstName.trim()) e.firstName = "Required.";
    if (!formData.lastName.trim()) e.lastName = "Required.";
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter a valid email.";
    if (!formData.password) e.password = "Required.";
    else if (formData.password.length < 8) e.password = "Min. 8 characters.";
    if (!formData.confirmPassword) e.confirmPassword = "Please confirm.";
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.firstName, formData.lastName);
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") setErrors({ email: "An account with this email already exists." });
      else setErrors({ general: "Sign up failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const field = (id: keyof FormData, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id} name={id} type={type} placeholder={placeholder}
        value={formData[id]} onChange={handleChange} autoComplete={id}
        className={`w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e] transition ${errors[id] ? "border-red-400 bg-red-50" : "border-gray-300"}`}
      />
      {errors[id] && <p className="text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/union-fall2017-ch-006-bw.webp"
          alt="Northwest Missouri State University"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#003d2a]/75" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <img src="/images/N-Horiz-Full.png" alt="NWMSU" className="h-10 w-auto brightness-0 invert mb-8" />
          <h2 className="text-4xl font-bold leading-tight mb-3">
            Join the<br />Community
          </h2>
          <p className="text-white/70 text-base max-w-sm">
            Submit papers, register for sessions, and connect with researchers at Northwest Conference 2026.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 text-sm">Start submitting and attending sessions</p>
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {errors.general}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field("firstName", "First Name", "text", "Jane")}
              {field("lastName", "Last Name", "text", "Doe")}
            </div>
            {field("email", "Email", "email", "you@example.com")}
            {field("password", "Password", "password", "Min. 8 characters")}
            {field("confirmPassword", "Confirm Password", "password", "Repeat password")}

            <button
              type="submit" disabled={loading}
              className="w-full h-11 bg-[#006a4e] hover:bg-[#00543d] text-white font-semibold rounded-lg transition disabled:opacity-60 mt-1"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#006a4e] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


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
  general?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
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

    try {
      await signup(formData.email, formData.password, formData.firstName, formData.lastName);
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({ email: "An account with this email already exists." });
      } else {
        setErrors({ general: "Sign up failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className={styles.signupCard}>

        <h1 className={styles.signupTitle}>Create Account</h1>
        <hr className={styles.signupDivider} />

        {errors.general && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
            {errors.general}
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
              placeholder="Min. 8 characters"
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
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ""}`}
            />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.btnSignup}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-[#006a4e] font-medium hover:underline">
              Sign in
            </Link>
          </p>

        </form>

      </div>
    </div>
  )
};