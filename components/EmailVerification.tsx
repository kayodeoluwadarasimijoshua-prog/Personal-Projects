import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export const EmailVerification = ({
  email,
  onVerified,
  onBack,
}: EmailVerificationProps) => {
  const { verifyOtp, resendVerification } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    setError('');
    setSuccessMessage('');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex(d => d === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    setError('');

    const result = await verifyOtp(email, code);

    if (result.success) {
      setSuccessMessage('Email verified successfully!');
      setTimeout(() => {
        onVerified();
      }, 1000);
    } else {
      setError(result.message || 'Invalid verification code. Please try again.');
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setError('');

    const result = await resendVerification(email);

    setIsResending(false);

    if (result.success) {
      setSuccessMessage('Verification email resent! Check your inbox.');
      setResendCooldown(60);
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setError(result.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    handleVerify(code);
  };

  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_match, start, middle, end) => `${start}${'•'.repeat(Math.max(middle.length, 3))}${end}`
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 mx-auto mb-5 relative"
            >
              <div className="w-full h-full bg-indigo-50 rounded-2xl flex items-center justify-center ring-8 ring-indigo-50/50">
                <Mail size={32} className="text-indigo-600" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                className="absolute -top-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <ShieldCheck size={14} className="text-white" />
              </motion.div>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gray-800 font-semibold text-sm mt-1">{maskedEmail}</p>
          </div>

          {/* Info banner */}
          <div className="mb-5">
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs leading-relaxed">
              <Mail size={14} className="shrink-0 mt-0.5 text-blue-500" />
              <span>
                Check your email inbox (and spam folder) for a 6-digit code from Supabase. Enter it below to verify your account.
              </span>
            </div>
          </div>

          {/* Success message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5"
              >
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
                  <ShieldCheck size={16} className="shrink-0" />
                  {successMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5"
              >
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index + 0.2 }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={cn(
                    'w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none bg-gray-50/50 text-gray-900',
                    digit
                      ? 'border-indigo-400 bg-indigo-50/30 shadow-sm shadow-indigo-100'
                      : 'border-gray-200 hover:border-gray-300',
                    'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white',
                    error && 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/10'
                  )}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Verify Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isVerifying || otp.some(d => d === '')}
              className={cn(
                'w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200/50',
                (isVerifying || otp.some(d => d === '')) && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck size={18} className="mr-2" />
                  Verify Email
                </>
              )}
            </motion.button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-semibold transition-colors',
                resendCooldown > 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-indigo-600 hover:text-indigo-500'
              )}
            >
              {isResending ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <RefreshCw size={14} />
                  Resend in {resendCooldown}s
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Resend Code
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 w-full text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back to Sign Up
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
