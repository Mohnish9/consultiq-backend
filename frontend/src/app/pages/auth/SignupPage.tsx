import { useState } from "react";
import { signup } from "../../services/authService";

interface SignupPageProps {
  onBackToLogin: () => void;
}

export function SignupPage({ onBackToLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"consultant" | "patient">("patient");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signup(
        email,
        password,
        name,
        role
      );

      alert("Account created successfully!");
      onBackToLogin();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Create Account
      </h1>

      <form onSubmit={handleSignup} className="space-y-4">

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "consultant" | "patient")
          }
          className="w-full border p-2 rounded"
        >
          <option value="consultant">Consultant</option>
          <option value="patient">Patient</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full border p-2 rounded"
        >
          Back to Login
        </button>

      </form>
    </div>
  );
}