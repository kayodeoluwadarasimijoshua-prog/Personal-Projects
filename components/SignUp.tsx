import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { BrandingPanel } from './BrandingPanel';

interface SignUpProps {
  onSwitchToLogin: () => void;
  onVerificationNeeded: (email: string) => void;
}

export const SignUp = ({ onSwitchToLogin, onVerificationNeeded }: SignUpProps) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', agree: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const calculateStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = calculateStrength(formData.password);
  const strengthData = [
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-orange-400' },
    { label: 'Good', color: 'bg-blue-400' },
    { label: 'Strong', color: 'bg-emerald-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) return setError('Password must be at least 8 characters');
    if (!formData.agree) return setError('Please agree to the Terms of Service');

    setIsLoading(true);
    const result = await signUp(formData.name, formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => onVerificationNeeded(formData.email), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        <BrandingPanel variant="signup" />
        
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex items-center">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Check your email!</h3>
                <p className="text-slate-500">We've sent a 6-digit verification code to {formData.email}</p>
              </motion.div>
            ) : (
              <div className="w-full">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                  <p className="text-slate-500 mt-1">Start your 14-day free trial today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex gap-2 items-center"><AlertCircle size={16} />{error}</div>}
                  
                  <InputField label="Full Name" icon={User} placeholder="John Doe" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                  <InputField label="Email Address" icon={Mail} placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                  
                  <div className="space-y-1">
                    <InputField label="Password" icon={Lock} placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(v) => setFormData({...formData, password: v})} />
                    {formData.password && (
                      <div className="px-1 pt-2">
                        <div className="flex gap-1 h-1.5 mb-1.5">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`flex-1 rounded-full transition-colors ${i <= strength ? strengthData[strength-1].color : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Strength: <span className={strength > 0 ? 'text-indigo-600' : ''}>{strength > 0 ? strengthData[strength-1].label : 'Too short'}</span></p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <input type="checkbox" checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} className="rounded text-indigo-600" />
                    <label className="text-xs text-slate-500">I agree to the <a href="#" className="text-indigo-600 font-bold underline">Terms</a> and <a href="#" className="text-indigo-600 font-bold underline">Privacy Policy</a></label>
                  </div>

                  <button disabled={isLoading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all">
                    {isLoading ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
                  </button>
                </form>

                <p className="mt-8 text-center text-slate-500 font-medium">Already have an account? <button onClick={onSwitchToLogin} className="text-indigo-600 font-bold">Log In</button></p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, type = 'text', ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input type={type} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} />
    </div>
  </div>
);