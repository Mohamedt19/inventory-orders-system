import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function LogoMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2CF63] text-[#184B63] shadow-sm">
      <svg
        viewBox="0 0 64 64"
        className="h-6 w-6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="16" width="18" height="32" rx="4" fill="currentColor" />
        <circle cx="39" cy="32" r="13" fill="currentColor" opacity="0.35" />
      </svg>
    </div>
  );
}

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#EEF3F5]">
      <div className="hidden w-[420px] flex-col justify-between bg-[#184B63] px-10 py-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-4">
            <LogoMark />
            <div>
              <div className="text-3xl font-semibold tracking-tight">
                Operations Control Panel
              </div>
              <div className="mt-1 text-sm text-white/70">
                Inventory & order management
              </div>
            </div>
          </div>

          <div className="mt-16 max-w-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              Inventory Operations
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Create a workspace account for inventory and order control.
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Set up access to manage products, supplier records, stock levels,
              and purchase or sales orders in one system.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-medium text-white">
            Built for inventory operations
          </div>
          <div className="mt-2 text-sm leading-6 text-white/65">
            Track products, supplier coverage, stock health, and order flow
            with a clean operations dashboard.
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Operations Control Panel
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign up to manage products, suppliers, stock, and orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#184B63]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#184B63]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#184B63]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#184B63] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#12384B]"
            >
              Register
            </button>
          </form>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#184B63] transition hover:text-[#12384B]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}