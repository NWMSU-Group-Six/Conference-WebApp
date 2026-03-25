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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Green header strip */}
        <div className="bg-[#006a4e] px-8 py-6">
          <img
            src="/images/N-Horiz-Full.png"
            alt="Northwest Missouri State University"
            className="h-8 w-auto brightness-0 invert mb-4"
          />
          <h1 className="text-xl font-bold text-white">Create your account</h1>
          <p className="text-white/70 text-sm mt-1">Northwest Conference 2026</p>
        </div>

        {/* Form body */}
        <div className="px-8 py-8">
          {errors.general && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
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
              className="w-full h-11 bg-[#006a4e] hover:bg-[#00543d] text-white font-semibold rounded-lg transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#006a4e] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
