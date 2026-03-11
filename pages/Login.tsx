import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
        const success = await login(email, password);
        if (success) {
            navigate('/'); // Redirect to home on success
        } else {
            setError('Invalid email or password. Try "jane.cooper@example.com" for Admin.');
        }
    } catch (err) {
        setError('An error occurred. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8 pb-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                         <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                <p className="text-slate-500 text-sm mt-1">Sign in to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="size-4" />
                        {error}
                    </div>
                )}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 size-5 text-slate-400" />
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                     <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <a href="#" className="text-xs font-semibold text-primary hover:text-blue-700">Forgot password?</a>
                     </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 size-5 text-slate-400" />
                        <input 
                            type="password" 
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? <Loader2 className="size-5 animate-spin" /> : <>Sign In <ArrowRight className="size-5" /></>}
                </button>
            </form>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Create Account</Link>
        </div>
        <div className="px-8 pb-4 text-xs text-slate-400 text-center">
            <p>Demo Admin: jane.cooper@example.com</p>
            <p>Demo User: esther.howard@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;