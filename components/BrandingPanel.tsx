import { CheckCircle, Shield, Zap } from 'lucide-react';

interface BrandingPanelProps {
  variant: 'signup' | 'login';
}

export const BrandingPanel = ({ variant }: BrandingPanelProps) => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-12 flex-col justify-between relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 bg-indigo-600 rounded-md" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Dara Personal-Project</span>
        </div>

        {variant === 'signup' ? (
          <>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Start your journey<br />with us today.
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
              Join thousands of professionals who trust our platform to manage their workflow efficiently.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Welcome back.<br />We missed you.
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
              Log in to your account to pick up right where you left off.
            </p>
          </>
        )}
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
            <CheckCircle size={18} />
          </div>
          <span className="text-indigo-100">
            {variant === 'signup' ? 'No credit card required' : 'Secure encrypted login'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
            <Zap size={18} />
          </div>
          <span className="text-indigo-100">
            {variant === 'signup' ? '14-day free trial' : 'Lightning fast dashboard'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
            <Shield size={18} />
          </div>
          <span className="text-indigo-100">
            {variant === 'signup' ? 'Cancel anytime' : 'Your data is safe with us'}
          </span>
        </div>
      </div>
    </div>
  );
};
