import React, { useState } from "react";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion'
import AuthInput from "../../components/authentication/AuthInput";
import { useAuthStore } from "../../store/useAuthStore";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center sm:items-center">
      <div className="w-full max-w-full sm:max-w-md h-screen sm:h-auto bg-[#0d0d0d] border border-neutral-800 rounded-none sm:rounded-3xl p-8 shadow-2xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-gray-400 text-sm mt-2">
            Reset your NAS account password
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-400 text-sm text-center">
              Enter your email address and we'll send you a password reset link.
            </p>

            {/* Using Your AuthInput Component */}
            <AuthInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
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
              disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="
              w-16 h-16              
             text-black
              bg-[linear-gradient(120deg,#ff4ecd,#ff8a3d,#ffe84a,#6dffb3,#42d4ff,#5b8cff,#b06cff)]
              bg-size-[100%_100%] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-neutral-900" />
            </motion.div>

            <p className="text-gray-300 text-sm">
              If an account exists for{" "}
              <span className="text-white">{email}</span>, you will receive a
              password reset link shortly.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-center">
          <Link
            to="/sign-in"
            className="text-sm text-blue-500 hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
