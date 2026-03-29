import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../../Redux/AuthSlice';
import { setSocketAuthToken } from '../../socket/socket';

export default function OTPForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || { email: '' };
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(120); // 5 minutes = 300 seconds
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer === 0) {
      setResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.substring(0, 1);
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtpValues[i] = pastedData[i] || '';
      }
      setOtpValues(newOtpValues);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otpValues.join('');
    console.log('Submitted OTP:', otpCode);
    axios.post(`${baseUrl}/api/auth/verify-otp`, { email, otp: otpCode })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.user));
        localStorage.setItem("token", res.data.token);
        setSocketAuthToken(res.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setOtpValues(Array(6).fill(''));
        inputRefs.current[0].focus();
      });
  };

  const handleResendOTP = () => {
    axios.post(`${baseUrl}/api/auth/resend-otp`, { email })
      .then((res) => {
        console.log(res.data);
        toast.success('New OTP sent to your email.');
        setOtpValues(Array(6).fill(''));
        inputRefs.current[0].focus();
        setTimer(120); // Reset timer to 5 minutes
        setResendDisabled(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to resend OTP.');
      });
  };

  // Format timer (mm:ss)
  const formatTimer = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-4 md:py-10 md:px-6 px-4 py-8 text-left text-sm rounded-lg transition-all shadow-lg 
        bg-white text-gray-700 shadow-gray-300 
        dark:bg-gray-800 dark:text-gray-300 dark:shadow-black/40"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Two-factor Authentication
        </h2>
        <p>Please enter the authentication code</p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The authentication code has been sent to your email:
        </p>

        <div className="flex items-center justify-between mb-6">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-10 border outline-none rounded text-center text-lg transition 
              bg-gray-100 text-gray-900 border-gray-300 focus:border-indigo-500
              dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-indigo-500"
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              required
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm">
            Time Remaining: <span className="font-semibold">{formatTimer()}</span>
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendDisabled}
            className={`text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition ${
              resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Resend OTP
          </button>
        </div>

        <button
          type="submit"
          className="w-full my-1 bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded text-white active:scale-95 transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
