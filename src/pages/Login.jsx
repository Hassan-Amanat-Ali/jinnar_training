import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import AuthPageImg from "../assets/images/auth-page-img.png";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import FirebaseUtils from "../utils/firebaseUtils";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("Please enter your email address.", {
        position: "top-center",
      });
      return;
    }

    if (!FirebaseUtils.validateEmail(email)) {
      toast.warning("Please enter a valid email address.", {
        position: "top-center",
      });
      return;
    }

    if (!password.trim()) {
      toast.warning("Please enter your password.", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const result = await FirebaseUtils.completeLogin(email, password);

      if (result.success) {
        toast.success(result.message, { position: "top-center" });
        navigate(ROUTES.EDIT_PROFILE);
      } else {
        toast.error(result.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await FirebaseUtils.completeSocialLogin("google");

      if (result.success) {
        toast.success(result.message, { position: "top-center" });
        navigate(ROUTES.EDIT_PROFILE);
      } else {
        toast.error(result.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);

    try {
      const result = await FirebaseUtils.completeSocialLogin("github");

      if (result.success) {
        toast.success(result.message, { position: "top-center" });
        navigate(ROUTES.EDIT_PROFILE);
      } else {
        toast.error(result.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      toast.error("Failed to sign in with GitHub. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side image */}
      <div className="hidden lg:block relative">
        <img
          src={AuthPageImg}
          alt="Students collaborating on laptop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(45deg, rgba(0,61,119,0.5), rgba(0,0,0,0.5))",
          }}
        />
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back to Home link */}
          <div className="mb-8">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200 hover:bg-gray-50 rounded-lg group"
            >
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-black">
              Welcome Back 👋
            </h2>
            <p className="mt-3 text-sm text-black/70 leading-relaxed">
              Sign in to access your account and continue where you left off.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email :"
              type="email"
              placeholder="Please enter your email address"
              className="h-12 rounded-none focus:ring-0 focus:ring-offset-0 focus:border-none bg-[#D9D9D9]/24 "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Password :"
              type="password"
              placeholder="Please enter password"
              className="h-12 rounded-none focus:ring-0 focus:ring-offset-0 focus:border-none bg-[#D9D9D9]/24 "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              text={loading ? "Signing in..." : "Continue"}
              className="btn-base-medium btn-primary w-full rounded-none h-12"
              type="submit"
              disabled={loading}
            />
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-black/60">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Social logins */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 border border-gray-300 bg-white hover:bg-gray-50 rounded-none flex items-center gap-3 justify-start px-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle className="text-xl" />
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </button>
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full h-12 border border-gray-300 bg-white hover:bg-gray-50 rounded-none flex items-center gap-3 justify-start px-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGithub className="text-xl" />
              <span>{loading ? "Signing in..." : "Continue with GitHub"}</span>
            </button>
          </div>

          {/* Account prompt */}
          <p className="mt-6 text-center text-sm text-black/70">
            Don't have an account?{" "}
            <Link to={ROUTES.SIGNUP} className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
