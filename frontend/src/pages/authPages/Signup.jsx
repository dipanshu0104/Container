import React, { useState } from "react";
import PasswordStrengthMeter from "../../components/authentication/PasswordStrengthMeter";
import AuthInput from "../../components/authentication/AuthInput";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import logo from "../../assets/Container.png"

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { signup, isLoading, error } = useAuthStore();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/verify");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
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
        <div className="flex flex-col items-center gap-4 mb-6">
          <div
            className="
              w-20 h-20
              flex items-center justify-center
              rounded-xl
            "
          >
           <img src={logo} alt="logo" />
          </div>

          <h1 className="text-2xl font-bold text-white">Create Account</h1>

          <p className="text-neutral-400 text-sm">Start your NAS journey</p>
        </div>

        <div className="flex flex-col gap-4">
          <AuthInput
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
          />

          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
          />

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

          <PasswordStrengthMeter password={form.password} />

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <button
            className="
    mt-2
    w-full
    py-3
    rounded-lg
    font-semibold
    text-black
    bg-[linear-gradient(120deg,#ff4ecd,#ff8a3d,#ffe84a,#6dffb3,#42d4ff,#5b8cff,#b06cff)]
    bg-size-[100%_100%]
    hover:bg-right
    transition-all
    duration-700
    hover:scale-[1.03]
    active:scale-[0.97]
  "
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-neutral-400 text-sm mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
