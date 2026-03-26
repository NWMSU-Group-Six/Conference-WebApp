import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { useAuth } from "@/context/AuthContext";
import { registerForConference } from "@/firebase/services/userService";
import Hero from "@/components/custom/Hero";

const registrationData = [
  { type: "Regular", early: "$165", late: "$190" },
  { type: "Faculty", early: "$75", late: "$75" },
  { type: "Alumni", early: "$70", late: "$70" },
  { type: "Student – Full Conference", early: "$70", late: "$70" },
  { type: "Student – Saturday Only", early: "$30", late: "$30" },
  { type: "Vendor", early: "$135", late: "$135" },
];

export default function Registration() {
  const { firebaseUser, userProfile, refreshProfile } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegistered = userProfile?.registration?.registered === true;

  const handleRegister = async () => {
    if (!firebaseUser) return;
    if (!selectedTicket) {
      setError("Please select a registration type.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await registerForConference(firebaseUser.uid, selectedTicket);
      await refreshProfile();
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero
        title="Registration"
        subtitle="Register to attend the Conference at Northwest Missouri State University"
      />
      <div className={styles.registrationPage}>
        <div className={styles.registrationContainer}>
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

          {/* Registration Action */}
          <div className={styles.registrationCard}>
            <h2 className={styles.sectionTitle}>Register Now</h2>

            {!firebaseUser ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-gray-600">
                  You must be signed in to register for the conference.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-[#006a4e] hover:bg-[#00543d] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
                >
                  Sign In to Register
                </Link>
              </div>
            ) : isRegistered ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
                <span className="text-green-600 text-xl font-bold">✓</span>
                <div>
                  <p className="text-green-800 font-semibold">
                    You are registered!
                  </p>
                  <p className="text-green-700 text-sm">
                    Ticket: {userProfile?.registration?.ticketType} · Status:{" "}
                    <span className="capitalize">
                      {userProfile?.registration?.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="font-medium">
                    {userProfile?.profile?.firstName || firebaseUser.email}
                  </span>
                  . Select your registration type below.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Type
                  </label>
                  <select
                    value={selectedTicket}
                    onChange={(e) => {
                      setSelectedTicket(e.target.value);
                      setError("");
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                  >
                    <option value="">— Select type —</option>
                    {registrationData.map((row) => (
                      <option key={row.type} value={row.type}>
                        {row.type} (Early: {row.early})
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="bg-[#006a4e] hover:bg-[#00543d] text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60 w-fit"
                >
                  {loading ? "Registering…" : "Register for Conference"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
