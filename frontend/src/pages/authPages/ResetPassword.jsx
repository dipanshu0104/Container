import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import AuthInput from "../../components/authentication/AuthInput";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center sm:items-center">
      <div className="w-full max-w-full sm:max-w-md h-screen sm:h-auto bg-[#0d0d0d] border border-neutral-800 rounded-none sm:rounded-3xl p-8 shadow-2xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 text-sm mt-2">
            Create a new password for your account
          </p>
        </div>

        {!isSuccess ? (
          <>
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <AuthInput
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <AuthInput
                label="Confirm Password"
                name="password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                  "Set New Password"
                )}
              </motion.button>
            </form>
          </>
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
              <Lock className="h-8 w-8 text-neutral-900" />
            </motion.div>

            <p className="text-gray-300 text-sm mb-6">
              Your password has been reset successfully.
            </p>

            <Link
              to="/sign-in"
              className="text-blue-500 hover:underline text-sm"
            >
              Go back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
