import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import OtpInput from "../../components/authentication/OtpInput";
import {Loader} from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore";

const VerifyOtp = () => {
  const [code, setCode] = useState("");
  const {verifyEmail, isLoading, error} = useAuthStore();
  const navigate = useNavigate();

  const handleComplete = async (value) => {
    setCode(value);
		try {
			await verifyEmail(value);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div
        className="
          w-full max-w-md
          h-screen sm:h-auto
          bg-[#0b0b0b]
          border border-neutral-800
          rounded-none sm:rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Top Section */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Verify your login
          </h1>

          <p className="text-neutral-400 text-sm mb-6">
            Enter the verification code we sent to your email
          </p>

          {/* Label + Resend */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-neutral-300 font-medium">
              Verification code
            </span>

            <button
              className="
                text-xs
                px-3 py-1
                rounded-md
                border border-neutral-700
                text-neutral-300
                hover:bg-neutral-800
                transition
              "
            >
              Resend Code
            </button>
          </div>

          {/* OTP Inputs (Single Continuous Group) */}
          <div className="flex justify-center">
            <OtpInput
              length={6}
              onComplete={handleComplete}
              inputClassName="
                w-12 h-14
                bg-[#111]
                border border-neutral-700
                text-white
                text-lg
                rounded-lg
                mx-1
                focus:border-purple-500
                focus:ring-1
                focus:ring-purple-500
                transition
              "
            />
          </div>

             {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          {/* Email Access Link */}
          <p className="text-sm text-neutral-500 mt-4 underline cursor-pointer hover:text-neutral-300 transition">
            I no longer have access to this email address.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800" />

        {/* Bottom Section */}
        <div className="p-6">
          <button
            className="
              w-full
              py-3
              rounded-lg
              font-semibold
              text-black
              cursor-pointer
              bg-[linear-gradient(120deg,#ff4ecd,#ff8a3d,#ffe84a,#6dffb3,#42d4ff,#5b8cff,#b06cff)]
              transition-all
              duration-700
              hover:scale-[1.03]
              active:scale-[0.97]
            "
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Verify"
            )}
          </button>

          <p className="text-center text-sm text-neutral-500 mt-4">
            Having trouble signing in?{" "}
            <span className="underline cursor-pointer hover:text-neutral-300 transition">
              Contact support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
