import React, { useState } from "react";
import AuthInput from "../../components/authentication/AuthInput";
import { Link } from "react-router-dom";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import logo from "../../assets/Container.png"

const Signin = () => {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full h-screen sm:h-auto max-w-full sm:max-w-md
          bg-[#0b0b0b] border border-neutral-800
          rounded-none sm:rounded-3xl
          p-8
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-xl">
            {/* Logo here */}
            <img src={logo} alt="logo" />
          </div>

          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>

          <p className="text-neutral-400 text-sm">
            Sign in to your NAS account
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {/* Email / Username */}
          <AuthInput
            label="Email / Username"
            name="identifier"
            type="text"
            placeholder="your@email.com"
            value={form.identifier}
            onChange={handleChange}
          />

          {/* Password Section */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-neutral-300">Password</label>

              <span className="text-sm text-blue-500 cursor-pointer hover:underline">
                <Link to="/forgot-password">Forgot password?</Link>
              </span>
            </div>

            <div className="relative">
              <AuthInput
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="pr-10"
              />

              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute right-3 top-5
                  text-neutral-400 hover:text-white
                  transition
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          {/* Submit Button */}
          <button
            disabled={isLoading}
            className="
              mt-2
              w-full
              py-3
              rounded-lg
              font-semibold
              text-black
              bg-[linear-gradient(120deg,#ff4ecd,#ff8a3d,#ffe84a,#6dffb3,#42d4ff,#5b8cff,#b06cff)]
              bg-size-[100%_100%]
              transition-all
              duration-700
              hover:scale-[1.03]
              active:scale-[0.97]
              disabled:opacity-70
            "
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-neutral-400 text-sm mt-2">
            First time here?{" "}
            <Link to="/sign-up" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signin;
