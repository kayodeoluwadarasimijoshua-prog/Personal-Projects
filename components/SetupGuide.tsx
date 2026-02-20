import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, ExternalLink, Copy, Check, Key, Globe, AlertTriangle, ArrowRight } from 'lucide-react';

interface SetupGuideProps {
  onSkipToDemo: () => void;
}

export const SetupGuide = ({ onSkipToDemo }: SetupGuideProps) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      number: 1,
      title: 'Create a Supabase Project',
      description: 'Go to supabase.com, create a free account and a new project.',
      link: 'https://supabase.com/dashboard',
      linkText: 'Open Supabase Dashboard',
    },
    {
      number: 2,
      title: 'Get your API Credentials',
      description: 'Navigate to Settings → API in your Supabase project. Copy the Project URL and anon public key.',
      details: [
        { label: 'Project URL', icon: Globe, example: 'https://xxxxx.supabase.co' },
        { label: 'Anon Key', icon: Key, example: 'eyJhbGciOiJIUzI1NiIs...' },
      ],
    },
    {
      number: 3,
      title: 'Create a .env file',
      description: 'Create a .env file in the root of this project with your credentials:',
      code: 'VITE_SUPABASE_URL=your_project_url_here\nVITE_SUPABASE_ANON_KEY=your_anon_key_here',
    },
    {
      number: 4,
      title: 'Enable Email + Google providers',
      description: 'In Supabase Dashboard, go to Authentication → Providers. Enable Email (with Confirm email) and Google. In Google settings, add your app URL as an authorized redirect URL (for local dev: http://localhost:5173).',
    },
    {
      number: 5,
      title: 'Restart the dev server',
      description: 'After creating the .env file, restart your development server to load the new environment variables.',
      code: 'npm run dev',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Database size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Supabase Setup Required</h1>
                  <p className="text-indigo-200 text-sm">Connect auth providers in 5 minutes</p>
                </div>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed max-w-lg">
                This app uses Supabase for authentication with email/password and Google OAuth. Follow the steps below to configure your Supabase project.
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="px-8 pt-6">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="font-semibold mb-1">Environment variables not found</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
                  <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>{' '}
                  are missing from your environment.
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-8 space-y-6">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * step.number }}
                className="flex gap-4"
              >
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.description}</p>

                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      {step.linkText}
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {step.details && (
                    <div className="space-y-2 mt-2">
                      {step.details.map((detail) => (
                        <div key={detail.label} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <detail.icon size={14} className="text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-600 font-medium">{detail.label}:</span>
                          <span className="text-xs text-gray-400 font-mono truncate">{detail.example}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.code && (
                    <div className="relative mt-2">
                      <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto font-mono leading-relaxed">
                        {step.code}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(step.code!, `step-${step.number}`)}
                        className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      >
                        {copiedStep === `step-${step.number}` ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} className="text-gray-300" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Mode Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg shadow-gray-200/40 p-6"
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              Want to see the UI without Supabase? Try demo mode with local state.
            </p>
            <button
              onClick={onSkipToDemo}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200/50"
            >
              Try Demo Mode
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
