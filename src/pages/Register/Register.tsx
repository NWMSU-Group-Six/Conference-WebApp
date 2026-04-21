import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { useAuth } from "@/context/AuthContext";
import { registerForConference } from "@/firebase/services/userService";
import Hero from "@/components/custom/Hero";
import type { Registration } from "@/models/Registration";
import { getDataByCollection } from "@/firebase/db";

export default function Registration() {
  const { firebaseUser, userProfile, refreshProfile } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationData, setRegistrationData] = useState<Registration[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
  firstName: "",
  lastName: "",
  address: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

  useEffect(() => {
    getDataByCollection<Registration>("registration")
      .then(setRegistrationData)
      .finally(() => setLoading(false));
  }, []);

  const isRegistered = userProfile?.registration?.registered === true;

  const handleRegister = async () => {
  if (!firebaseUser) return false;

  // Ticket check
  if (!selectedTicket) {
    setError("Please select a registration type.");
    return false;
  }

  // Billing validation
  if (!billingInfo.firstName || !billingInfo.lastName) {
    setError("Please enter your full name.");
    return false;
  }

  if (!billingInfo.address) {
    setError("Address Line 1 is required.");
    return false;
  }

  if (!paymentMethod) {
    setError("Please select a payment method.");
    return false;
  }

  // Card validation (only if card selected)
  if (paymentMethod === "card") {
    if (!billingInfo.cardNumber || billingInfo.cardNumber.length < 19) {
      setError("Please enter a valid card number.");
      return false;
    }

    if (!billingInfo.expiry || billingInfo.expiry.length < 7) {
      setError("Please enter a valid expiry date (MM/YYYY).");
      return false;
    }

    if (!billingInfo.cvv || billingInfo.cvv.length < 3) {
      setError("Please enter a valid CVV.");
      return false;
    }
  }

  setError("");
  setLoading(true);

  try {
    await registerForConference(firebaseUser.uid, selectedTicket);
    await refreshProfile();
    return true;
  } catch {
    setError("Registration failed. Please try again.");
    return false;
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
              {loading ? (
                <p className="text-center text-gray-500 py-16">
                  Loading registration information...
                </p>
              ) : (
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
              )}
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
                    Please check your email for confirmation.
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
                
                {/* Payment Section */}
                <div className="border-t pt-4 mt-2 flex flex-col gap-4">
                  <h3 className="text-md font-semibold text-gray-800">
                    Billing Information
                  </h3>

                  {/* Name */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, firstName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                      onChange={(e) =>
                        setBillingInfo({ ...billingInfo, lastName: e.target.value })
                      }
                    />
                  </div>

                  {/* Address Line 1 */}
                  <input
                    type="text"
                    placeholder="Address Line 1 (required)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                    onChange={(e) =>
                      setBillingInfo({ ...billingInfo, address: e.target.value })
                    }
                  />

                  {/* Address Line 2 */}
                  <input
                    type="text"
                    placeholder="Address Line 2 (optional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                  />

                  {/* City, State, Zip */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                    >
                      <option value="">— Select Payment Method —</option>
                      <option value="cash">Cash</option>
                      <option value="check">Pay via Check</option>
                      <option value="card">Card</option>
                    </select>
                  </div>

                  {/* Cash */}
                  {paymentMethod === "cash" && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-3">
                      Submit a cash envelope at the CSIS office at least one week before the conference.
                    </div>
                  )}

                  {/* Check */}
                  {paymentMethod === "check" && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-3">
                      Please mail your check to the CSIS office at least one week before the conference.
                    </div>
                  )}

                  {/* Card */}
                  {paymentMethod === "card" && (
                    <div className="flex flex-col gap-3">
                      
                      {/* Card Number (grouped in 4s) */}
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm tracking-widest focus:ring-2 focus:ring-[#006a4e] outline-none"
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(.{4})/g, "$1 ").trim();
                          setBillingInfo({ ...billingInfo, cardNumber: value });
                        }}
                      />

                      {/* Expiry + CVV */}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          maxLength={7}
                          placeholder="MM/YYYY"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 3) {
                              value = value.slice(0, 2) + "/" + value.slice(2, 6);
                            }
                            setBillingInfo({ ...billingInfo, expiry: value });
                          }}
                        />
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="CVV"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006a4e] outline-none"
                          onChange={(e) =>
                            setBillingInfo({ ...billingInfo, cvv: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Confirmation */}
                  {paymentComplete && (
                    <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-3">
                      Registration complete!
                    </div>
                  )}
                </div>
                
                
                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  onClick={async () => {
                  const success = await handleRegister();
                  if (success) {
                    setPaymentComplete(true);
                  }
                }}
                
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
