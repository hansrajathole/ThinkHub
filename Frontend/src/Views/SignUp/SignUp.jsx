import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../Redux/AuthSlice";
import { setSocketAuthToken } from "../../socket/socket";


const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSignup, setisSignup] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    setisSignup(true)
    e.preventDefault();
    axios.post(`${baseUrl}/api/auth/signup`, { username, email, password })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/login/otpVerification", { state: { email } });
      })
      .catch((err) => {
        setisSignup(false)
        toast.error(err.response.data.message);

      });
  };

  const handleGoogleLogin = (access_token) => {
    axios.post(baseUrl+"/api/auth/google-login", { accessToken: access_token })
      .then((res) => {
        const {token,user,message} = res.data;
        localStorage.setItem("token",token)
        setSocketAuthToken(token);
        dispatch(setAuthUser(user));
        toast.success(message)
        navigate("/");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
      });
    };

    const googleLogin = useGoogleLogin({
        onSuccess : (response) => {
            handleGoogleLogin(response.access_token);
        },
        onError : () => toast("Google Login Failed...!")
    })
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 transition-all duration-300">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Sign up to your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Your email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="name@gmail.com"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: alex"
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 text-lg"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              required
              className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-400">
              Accept terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200 active:scale-95 ${
              isSignup ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
            }`}
          >
           {
            isSignup ? ("Please wait...") : ("Sign Up")

           }
          </button>

          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-1/4 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
            <div className="w-1/4 h-px bg-gray-300 dark:bg-gray-600" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 mt-2 bg-white dark:bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          onClick={googleLogin}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#34A853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285F4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#FBBC04" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#EA4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
